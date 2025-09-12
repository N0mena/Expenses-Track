import { PrismaClient } from "../generated/prisma/index.js"

const prisma = new PrismaClient()

export const getAllIncomes = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const incomes = await prisma.income.findMany({
      where: { userId }, 
      orderBy: { date: "desc" },
    })
    
    res.status(200).json({
      success: true,
      message: "Incomes retrieved successfully",
      data: {
        incomes,
        total: incomes.length
      }
    })
  } catch (error) {
    console.error("Error fetching incomes:", error)
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch incomes",
      error: error.message 
    })
  }
}

export const getIncomeById = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id; 
  
  try {
    const income = await prisma.income.findFirst({
      where: { 
        id: parseInt(id),
        userId 
      },
    })
    
    if (!income) {
      return res.status(404).json({ 
        success: false,
        message: "Income not found",
        error: "INCOME_NOT_FOUND"
      })
    }
    
    res.status(200).json({
      success: true,
      message: "Income retrieved successfully",
      data: income
    })
  } catch (error) {
    console.error("Error fetching income:", error)
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch income",
      error: error.message 
    })
  }
}

export const postNewIncome = async (req, res) => {
  const { amount, date, source, description } = req.body
  const userId = req.user.id;


  if (!amount || !date || !source) {
    return res.status(400).json({ 
      success: false,
      message: "Amount, date, and source are required.",
      error: "MISSING_REQUIRED_FIELDS"
    })
  }

  if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Amount must be a positive number",
      error: "INVALID_AMOUNT"
    })
  }

  try {
    const newIncome = await prisma.income.create({
      data: {
        amount: parseFloat(amount),
        date: new Date(date),
        source: source,
        description: description || null,
        userId 
      },
    })
    
    res.status(201).json({
      success: true,
      message: "Income created successfully",
      data: newIncome
    })
  } catch (error) {
    console.error("Error creating income:", error)
    res.status(500).json({ 
      success: false,
      message: "Failed to create income",
      error: error.message 
    })
  }
}

export const updateIncome = async (req, res) => {
  const { id } = req.params
  const { amount, date, source, description } = req.body
  const userId = req.user.id;

  if (!amount || !date || !source) {
    return res.status(400).json({ 
      success: false,
      message: "Amount, date, and source are required.",
      error: "MISSING_REQUIRED_FIELDS"
    })
  }

  if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Amount must be a positive number",
      error: "INVALID_AMOUNT"
    })
  }

  try {
    const existingIncome = await prisma.income.findFirst({
      where: { 
        id: parseInt(id),
        userId 
      }
    });

    if (!existingIncome) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
        error: "INCOME_NOT_FOUND"
      });
    }

    const updatedIncome = await prisma.income.update({
      where: { id: parseInt(id) },
      data: {
        amount: parseFloat(amount),
        date: new Date(date),
        source: source.trim(),
        description: description?.trim() || null,
        updatedAt: new Date()
      },
    })
    
    res.status(200).json({
      success: true,
      message: "Income updated successfully",
      data: updatedIncome
    })
  } catch (error) {
    console.error("Error updating income:", error)
    res.status(500).json({ 
      success: false,
      message: "Failed to update income",
      error: error.message 
    })
  }
}

export const deleteIncome = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id;

  try {
    const existingIncome = await prisma.income.findFirst({
      where: { 
        id: parseInt(id),
        userId 
      }
    });

    if (!existingIncome) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
        error: "INCOME_NOT_FOUND"
      });
    }

    await prisma.income.delete({
      where: { id: parseInt(id) },
    })
    
    res.status(200).json({
      success: true,
      message: "Income deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting income:", error)
    res.status(500).json({ 
      success: false,
      message: "Failed to delete income",
      error: error.message 
    })
  }
}