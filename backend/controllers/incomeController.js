import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getAllIncomes = async (req, res) => {
  try {
    const incomes = await prisma.income.findMany({
      orderBy: { date: "desc" },
    })
    res.status(200).json(incomes)
  } catch (error) {
    console.error("Error fetching incomes:", error)
    res.status(500).json({ error: "Failed to fetch incomes" })
  }
}

export const getIncomeById = async (req, res) => {
  const { id } = req.params
  try {
    const income = await prisma.income.findUnique({
      where: { id: parseInt(id) },
    })
    if (!income) {
      return res.status(404).json({ error: "Income not found" })
    }
    res.status(200).json(income)
  } catch (error) {
    console.error("Error fetching income:", error)
    res.status(500).json({ error: "Failed to fetch income" })
  }
}

export const postNewIncome = async (req, res) => {
  const { amount, date, source, description } = req.body

  if (!amount || !date || !source) {
    return res.status(400).json({ error: "Amount, date, and source are required." })
  }

  try {
    const newIncome = await prisma.income.create({
      data: {
        amount,
        date: new Date(date),
        source,
        description,
      },
    })
    res.status(201).json(newIncome)
  } catch (error) {
    console.error("Error creating income:", error)
    res.status(500).json({ error: "Failed to create income" })
  }
}

export const updateIncome = async (req, res) => {
  const { id } = req.params
  const { amount, date, source, description } = req.body

  if (!amount || !date || !source) {
    return res.status(400).json({ error: "Amount, date, and source are required." })
  }

  try {
    const updatedIncome = await prisma.income.update({
      where: { id: parseInt(id) },
      data: {
        amount,
        date: new Date(date),
        source,
        description,
      },
    })
    res.status(200).json(updatedIncome)
  } catch (error) {
    console.error("Error updating income:", error)
    res.status(500).json({ error: "Failed to update income" })
  }
}

export const deleteIncome = async (req, res) => {
  const { id } = req.params

  try {
    await prisma.income.delete({
      where: { id: parseInt(id) },
    })
    res.status(204).end()
  } catch (error) {
    console.error("Error deleting income:", error)
    res.status(500).json({ error: "Failed to delete income" })
  }
}