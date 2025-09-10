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
            sum: {
                amount: true
            }
        });

        const totalIncome = incomeResult.sum.amount || 0;

        const expenseResult = await prisma.expense.aggrergate({
            where: {
                userId: userId,
                date:{
                    gte: firstDay,
                    lte: lastDay
                }
            },
            sum: {
                amount: true
            }
        });

        const totalExpense = expenseResult.sum.amount || 0;

        const balance = totalIncome - totalExpense;


        res.json({
            succes: true,
            message: "Dashboard retrieved successfully",
            data: {
                period: `${month}/${year}`,
                totalIncome: totalIncome,
                totalExpense: totalIncome,
                balance: balance,
                isPositive: balance >= 0
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

