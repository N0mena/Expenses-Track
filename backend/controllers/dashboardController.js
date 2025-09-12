import { use } from 'react';
import { PrismaClient } from '../generated/prisma/index.js'; 

const prisma = new PrismaClient();


const getMonthDate = (year,month) => {
    const firstDay = new Date(year,month - 1,1);
    const lastDay = new Date(year, month , 0);
    lastDay.setHours(23,59,59);

    return { firstDay,lastDay };

};


export const getDashboard = async (req,res) =>{
    try {
        const userId = req.user.id;

        const currentDate = new Date();
        const year = parseInt(req.query.year) || currentDate.getFullYear();
        const month = parseInt(req.query.month) || (currentDate.getMonth() + 1);

        const { firstDay, lastDay} = getMonthDate(year,month);

        console.log(`Dashboard for ${month}/${year}`);
        console.log(`${firstDay} -> ${lastDay}`)

        const incomeResult = await prisma.income.aggrergate({
            where: {
                userId: userId,
                date: {
                    gte: firstDay,
                    lte: lastDay
                }
            },
            _sum: {
                amount: true
            }
        });

        const totalIncome = incomeResult._sum.amount || 0;

        const oneTimeExpenseResult = await prisma.expense.aggrergate({
            where: {
                userId: userId,
                type: 'one_time',
                date:{
                    gte: firstDay,
                    lte: lastDay
                }
            },
            _sum: {
                amount: true
            }
        });

          const reccuringExpenses = await prisma.expense.aggrergate({
            where: {
                userId: userId,
                type: 'recurring',
                startDate:{
                    lte: lastDay
                },
            OR:[
                 { endDate: null},
                 { endDate: { gte: firstDay} }
            ] 
            }
        });


          let totalRecurringExpenses = 0;
          reccuringExpenses.forEach(expense => {
              totalRecurringExpenses += expense.amount; 
          });
       
           const totalOneTimeExpenses = oneTimeExpenseResult._sum.amount || 0;
        const totalExpenses = totalOneTimeExpenses + totalRecurringExpenses;
        const balance = totalIncome - totalExpenses;

        res.json({
            succes: true,
            message: "Dashboard retrieved successfully",
            data: {
                period: `${month}/${year}`,
                totalIncome: totalIncome,
                totalExpenses: totalExpenses,
                oneTimeExpenses: totalOneTimeExpenses,
                recurringExpenses: totalRecurringExpenses,
                balance: balance,
                isPositive: balance >= 0,
                isOverBudget: totalExpenses > totalIncome,
                overBudgetAmount: totalExpenses > totalIncome ? totalExpenses - totalIncome : 0
            }
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            success: false,
            message: "Servor error",
            error: error.message
        });
    }

}

export const getExpensesByCategory = async (req,res) => {
    try {
       const oneTimeExpensesByCategory = await prisma.expense.groupBy({
            by: ['categoryId'],
            where: {
                userId: userId,
                type: 'one_time',
                date: {
                    gte: firstDay,
                    lte: lastDay
                }
            },
            _sum: {
                amount: true
            }
        });
        
        const recurringExpensesByCategory = await prisma.expense.groupBy({
            by: ['categoryId'],
            where: {
                userId: userId,
                type: 'recurring',
                startDate: {
                    lte: lastDay
                },
                OR: [
                    { endDate: null },
                    { endDate: { gte: firstDay } }
                ]
            },
            _sum: {
                amount: true
            }
        });
        
        const categoryTotals = {};
        
        oneTimeExpensesByCategory.forEach(item => {
            categoryTotals[item.categoryId] = (categoryTotals[item.categoryId] || 0) + (item._sum.amount || 0);
        });
        
        recurringExpensesByCategory.forEach(item => {
            categoryTotals[item.categoryId] = (categoryTotals[item.categoryId] || 0) + (item._sum.amount || 0);
        });

        const categoryIds = Object.keys(categoryTotals);
        const categories = await prisma.category.findMany({
            where: {
                id: { in: categoryIds }
            },
            select: {
                id: true,
                name: true
            }
        });
        
        const expensesByCategory = categories.map(category => ({
            categoryId: category.id,
            categoryName: category.name,
            totalAmount: categoryTotals[category.id] || 0
        }));
        
        const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
        
        const expensesWithPercentage = expensesByCategory.map(item => ({
            ...item,
            percentage: totalExpenses > 0 ? ((item.totalAmount / totalExpenses) * 100).toFixed(2) : 0
        }));
        
        expensesWithPercentage.sort((a, b) => b.totalAmount - a.totalAmount);
        
        res.json({
            success: true,
            message: "Expenses by category retrieved successfully",
            data: {
                period: `${month}/${year}`,
                totalExpenses: totalExpenses,
                categories: expensesWithPercentage,
                categoryCount: expensesWithPercentage.length
            }
        });
        
    } catch (error) {
        console.error('Expenses by category error:', error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}
export const getMonthlyTrend = async (req, res) => {
    try {
        const userId = req.user.id;
        const currentDate = new Date();
        const year = parseInt(req.query.year) || currentDate.getFullYear();
        const monthsCount = parseInt(req.query.months) || 6;
        const monthlyData = [];
        
        for (let i = monthsCount - 1; i >= 0; i--) {
            const targetDate = new Date(year, currentDate.getMonth() - i, 1);
            const targetYear = targetDate.getFullYear();
            const targetMonth = targetDate.getMonth() + 1;
            
            const { firstDay, lastDay } = getMonthDate(targetYear, targetMonth);
            

            const incomeResult = await prisma.income.aggregate({
                where: {
                    userId: userId,
                    date: {
                        gte: firstDay,
                        lte: lastDay
                    }
                },
                _sum: {
                    amount: true
                }
            });

            const oneTimeExpenseResult = await prisma.expense.aggregate({
                where: {
                    userId: userId,
                    type: 'one_time',
                    date: {
                        gte: firstDay,
                        lte: lastDay
                    }
                },
                _sum: {
                    amount: true
                }
            });

            const recurringExpenses = await prisma.expense.findMany({
                where: {
                    userId: userId,
                    type: 'recurring',
                    startDate: {
                        lte: lastDay
                    },
                    OR: [
                        { endDate: null },
                        { endDate: { gte: firstDay } }
                    ]
                }
            });
            
            const totalIncome = incomeResult._sum.amount || 0;
            const totalOneTimeExpenses = oneTimeExpenseResult._sum.amount || 0;
            const totalRecurringExpenses = recurringExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            const totalExpenses = totalOneTimeExpenses + totalRecurringExpenses;
            const balance = totalIncome - totalExpenses;
            
            monthlyData.push({
                year: targetYear,
                month: targetMonth,
                monthName: targetDate.toLocaleString('en-US', { month: 'long' }),
                period: `${targetMonth}/${targetYear}`,
                totalIncome,
                totalExpenses,
                balance,
                isPositive: balance >= 0
            });
        }
        
        res.json({
            success: true,
            message: "Monthly trend retrieved successfully",
            data: {
                months: monthlyData,
                period: `${monthsCount} months trend`,
                summary: {
                    avgIncome: monthlyData.reduce((sum, month) => sum + month.totalIncome, 0) / monthlyData.length,
                    avgExpenses: monthlyData.reduce((sum, month) => sum + month.totalExpenses, 0) / monthlyData.length,
                    avgBalance: monthlyData.reduce((sum, month) => sum + month.balance, 0) / monthlyData.length
                }
            }
        });
        
    } catch (error) {
        console.error('Monthly trend error:', error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};
