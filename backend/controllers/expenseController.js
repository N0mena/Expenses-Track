import { PrismaClient } from "../generated/prisma";

export const createExpense = async (req,res) => {
    try {
        const { title, amount,type, date ,categoryId , description , startDate, endDate, receipt } = req.body;

        if( !title || !amount ){
            return res.status(400).json({message: "require title and amount"})
        }
        const expenese = new Expense({
            title,
            type,
            date,
            categoryId,
            description,
            startDate,
            endDate,
            receipt
        })

        const savedExpense = await expenese.save();
        res.status(201).json(savedExpense);

    } catch (error) {
        res.status(500).json({message:"Error servor", error: error.message});      
    }
};