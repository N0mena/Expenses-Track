import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();
export const createExpense = async (req,res) => {
    try {
        const { amount,type, date ,categoryId , description , startDate, endDate, receipt } = req.body;

        if( !amount ){
            return res.status(400).json({message: "amount are required"})
        }

        if( !categoryId ){
            return res.status(400).json({message: "categoryId is required"})
        }

         const expense = await prisma.expense.create({
            data:{
                type: type ==='recurring'? 'recurring': 'one_time',
                amount: parseFloat(amount),
                date:  new Date(date),
                description: description || null,
                startDate: startDate ? new Date(startDate) : new Date(date),
                endDate: endDate ? new Date(endDate): null,
                receipt: receipt || null,
                user: {
                    connect: {
                        id: req.user.id
                    }
                },
                category: {
                    connect: {
                        id: categoryId
                    }
                }
            }
        });

        res.status(201).json(expense);

    } catch (error) {
        console.error('Create expense error:', error);
        res.status(500).json({message:"Error server", error: error.message});      
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
           where: { id: parseInt(id), userId},
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
           where: { id: parseInt(id), userId}
        })

        if(deleted.count === 0 ){
            return res.status(404).json({message:"Expense not found"})
        }
    
        res.status(204).send();
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const updateExpense = async (req,res) => {
    try {
       const { id } = req.params;
       const { userId } = req.user.id;
        const {  amount,date,categoryId,description,type,startDate,endDate} = req.body;
       
    const updated = await prisma.expense.updateMany({
     where: { id: parseInt(id), userId},
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        date: date ? new Date(date) : undefined,
        categoryId,
        description,
        type: type ? (type === "recurring" ? "recurring" : "one_time") : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        receipt: req.file ? req.file.path : undefined,
      },
    });

    if (updated.count === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }
    const expense = await prisma.expense.findUnique({ where: { id } });
    res.json(expense);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}