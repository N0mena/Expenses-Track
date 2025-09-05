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
            type,
            amount: parseFloat(amount),
            date: date ? new Date(date): new date(),
            categoryId,
            description,
            startDate: startDate ? new startDate(startDate): null,
            endDate: endDate ? new endDate(endDate): null,
            receipt
        })

        const savedExpense = await expense.save();
        res.status(201).json(savedExpense);

    } catch (error) {
        res.status(500).json({message:"Error servor", error: error.message});      
    }
};

export const getExpense = async (req,res) => {
    try {
        const expense = await prisma.expense.findMany({
            orderBy: { date: "desc"}
        })
        return res.json(expense)
    } catch (error) {
        res.status(500).json({message: "server error",error: error.message})   
    }
}