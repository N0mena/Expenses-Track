import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const createExpense = async (req,res) => {
    try {
        const { title, amount,type, date ,categoryId , description , startDate, endDate, receipt } = req.body;

        if( !title || !amount ){
            return res.status(400).json({message: "title and amount are required"})
        }
        const expense = await prisma.expense.create({
            title,
            type: type ==='reccuring'? 'recurring': 'one_time',
            amount: parseFloat(amount),
            date:  new Date(date),
            categoryId,
            description,
            startDate: startDate ? new startDate(startDate): null,
            endDate: endDate ? new endDate(endDate): null,
            receipt,
        })

        const savedExpense = await expense.save();
        res.status(201).json(savedExpense);

    } catch (error) {
        res.status(500).json({message:"Error servor", error: error.message});      
    }
};

export const getExpense = async (req,res) => {
    try {
        const { start,end,category,type} = req.query;

        const userId = req.user.id;
        const where = { userId };

        if( start || end){
            where.date= {};
            if (start) where.date.gte = new Date(start);
            if (end) where.date.lte = new Date(end)
        }
    } catch (error) {
        res.status(500).json({message: "server error",error: error.message})   
    }
}

export const getExpenseById = async (req,res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const expense = await prisma.expense.findFirst({
            where: { id, userId},
        });

        if(!expense){
            return res.status(404).json({ message: "Expense not found"})
        }
         res.json(expense);

    } catch (error) {
res.status(500).json({ message: "Server error", error: error.message });

    }
}

export const deleteExpense = async (req,res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user.id;
        
        const deleted = await prisma.expense.deleteMany({
            where: { id, userId },
        })

        if(deleted.count === 0 ){
            return res.status(404).json({message:"Expense not found"})
        }
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
