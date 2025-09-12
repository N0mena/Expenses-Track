import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

const getDateRange = (year, month) => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    lastDay.setHours(23, 59, 59, 999);
    return { firstDay, lastDay };
};

const calculateTotals = async (userId, startDate, endDate) => {
    const incomeResult = await prisma.income.aggregate({
        where: {
            userId: userId,
            date: {
                gte: startDate,
                lte: endDate
            }
        },
        _sum: { amount: true }
    });

    const oneTimeExpenseResult = await prisma.expense.aggregate({
        where: {
            userId: userId,
            type: 'one_time',
            date: {
                gte: startDate,
                lte: endDate
            }
        },
        _sum: { amount: true }
    });

    const recurringExpenses = await prisma.expense.findMany({
        where: {
            userId: userId,
            type: 'recurring',
            startDate: { lte: endDate },
            OR: [
                { endDate: null },
                { endDate: { gte: startDate } }
            ]
        },
        select: { amount: true }
    });

    const totalIncome = incomeResult._sum.amount || 0;
    const totalOneTimeExpenses = oneTimeExpenseResult._sum.amount || 0;
    const totalRecurringExpenses = recurringExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalExpenses = totalOneTimeExpenses + totalRecurringExpenses;
    const balance = totalIncome - totalExpenses;

    return {
        totalIncome,
        totalExpenses,
        oneTimeExpenses: totalOneTimeExpenses,
        recurringExpenses: totalRecurringExpenses,
        balance,
        isPositive: balance >= 0,
        isOverBudget: totalExpenses > totalIncome,
        overBudgetAmount: totalExpenses > totalIncome ? totalExpenses - totalIncome : 0
    };
};

export const getMonthlySummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const currentDate = new Date();

        let year, month;
        if (req.query.month) {
            const [yearStr, monthStr] = req.query.month.split('-');
            year = parseInt(yearStr);
            month = parseInt(monthStr);
        } else {
            year = currentDate.getFullYear();
            month = currentDate.getMonth() + 1;
        }

        const { firstDay, lastDay } = getDateRange(year, month);
        const totals = await calculateTotals(userId, firstDay, lastDay);

        const transactionCount = await prisma.expense.count({
            where: {
                userId: userId,
                type: 'one_time',
                date: {
                    gte: firstDay,
                    lte: lastDay
                }
            }
        });

        const incomeCount = await prisma.income.count({
            where: {
                userId: userId,
                date: {
                    gte: firstDay,
                    lte: lastDay
                }
            }
        });

        const topCategories = await prisma.expense.groupBy({
            by: ['categoryId'],
            where: {
                userId: userId,
                date: {
                    gte: firstDay,
                    lte: lastDay
                }
            },
            _sum: { amount: true },
            orderBy: { _sum: { amount: 'desc' } },
            take: 3
        });

        const categoryDetails = await prisma.category.findMany({
            where: {
                id: { in: topCategories.map(cat => cat.categoryId) }
            },
            select: { id: true, name: true }
        });

        const topCategoriesWithNames = topCategories.map(cat => {
            const categoryInfo = categoryDetails.find(detail => detail.id === cat.categoryId);
            return {
                categoryId: cat.categoryId,
                categoryName: categoryInfo?.name || 'Unknown',
                amount: cat._sum.amount || 0
            };
        });

        res.json({
            success: true,
            message: "Monthly summary retrieved successfully",
            data: {
                period: `${year}-${month.toString().padStart(2, '0')}`,
                month: new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
                ...totals,
                statistics: {
                    transactionCount,
                    incomeCount,
                    averageTransaction: transactionCount > 0 ? (totals.totalExpenses / transactionCount) : 0,
                    topCategories: topCategoriesWithNames
                }
            }
        });

    } catch (error) {
        console.error('Monthly summary error:', error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const getCustomSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const { start, end } = req.query;

        if (!start || !end) {
            return res.status(400).json({
                success: false,
                message: "Both start and end dates are required",
                error: "MISSING_DATE_RANGE"
            });
        }

        const startDate = new Date(start);
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Use YYYY-MM-DD",
                error: "INVALID_DATE_FORMAT"
            });
        }

        if (startDate > endDate) {
            return res.status(400).json({
                success: false,
                message: "Start date must be before end date",
                error: "INVALID_DATE_RANGE"
            });
        }

        const totals = await calculateTotals(userId, startDate, endDate);

        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        const dailyAverages = {
            income: totals.totalIncome / daysDiff,
            expenses: totals.totalExpenses / daysDiff,
            balance: totals.balance / daysDiff
        };

        const expensesByCategory = await prisma.expense.groupBy({
            by: ['categoryId'],
            where: {
                userId: userId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            _sum: { amount: true }
        });

        const categoryDetails = await prisma.category.findMany({
            where: {
                id: { in: expensesByCategory.map(exp => exp.categoryId) }
            },
            select: { id: true, name: true }
        });

        const categorizedExpenses = expensesByCategory.map(exp => {
            const categoryInfo = categoryDetails.find(detail => detail.id === exp.categoryId);
            return {
                categoryId: exp.categoryId,
                categoryName: categoryInfo?.name || 'Unknown',
                amount: exp._sum.amount || 0,
                percentage: totals.totalExpenses > 0 ? ((exp._sum.amount / totals.totalExpenses) * 100).toFixed(2) : 0
            };
        });

        categorizedExpenses.sort((a, b) => b.amount - a.amount);

        res.json({
            success: true,
            message: "Custom period summary retrieved successfully",
            data: {
                period: {
                    start: start,
                    end: end,
                    days: daysDiff
                },
                ...totals,
                dailyAverages,
                expensesByCategory: categorizedExpenses
            }
        });

    } catch (error) {
        console.error('Custom summary error:', error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const getBudgetAlerts = async (req, res) => {
    try {
        const userId = req.user.id;
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;

        const { firstDay, lastDay } = getDateRange(year, month);
        const totals = await calculateTotals(userId, firstDay, lastDay);

        const alerts = [];

        if (totals.isOverBudget) {
            alerts.push({
                type: "budget_exceeded",
                severity: "high",
                title: "Budget Exceeded",
                message: `You've exceeded your monthly budget by $${totals.overBudgetAmount.toFixed(2)}`,
                amount: totals.overBudgetAmount
            });
        }

        const spendingRatio = totals.totalIncome > 0 ? (totals.totalExpenses / totals.totalIncome) : 0;
        if (!totals.isOverBudget && spendingRatio > 0.8) {
            alerts.push({
                type: "high_spending",
                severity: "medium",
                title: "High Spending Alert",
                message: `You've spent ${(spendingRatio * 100).toFixed(1)}% of your monthly income`,
                percentage: (spendingRatio * 100).toFixed(1)
            });
        }


        if (totals.totalIncome === 0 && totals.totalExpenses > 0) {
            alerts.push({
                type: "no_income",
                severity: "high",
                title: "No Income Recorded",
                message: "You have expenses but no income recorded for this month"
            });
        }

        const recurringRatio = totals.totalExpenses > 0 ? (totals.recurringExpenses / totals.totalExpenses) : 0;
        if (recurringRatio > 0.7) {
            alerts.push({
                type: "high_recurring",
                severity: "low",
                title: "High Recurring Expenses",
                message: `${(recurringRatio * 100).toFixed(1)}% of your expenses are recurring`,
                percentage: (recurringRatio * 100).toFixed(1)
            });
        }

        const hasMainAlert = totals.isOverBudget;
        const mainAlertMessage = hasMainAlert 
            ? `You've exceeded your monthly budget by $${totals.overBudgetAmount.toFixed(2)}`
            : null;

        res.json({
            success: true,
            message: "Budget alerts retrieved successfully",
            data: {
                alert: hasMainAlert,
                message: mainAlertMessage,
                period: `${year}-${month.toString().padStart(2, '0')}`,
                summary: {
                    totalIncome: totals.totalIncome,
                    totalExpenses: totals.totalExpenses,
                    balance: totals.balance,
                    overBudgetAmount: totals.overBudgetAmount,
                    spendingRatio: (spendingRatio * 100).toFixed(1)
                },
                alerts: alerts,
                alertCount: alerts.length
            }
        });

    } catch (error) {
        console.error('Budget alerts error:', error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};