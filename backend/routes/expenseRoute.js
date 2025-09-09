import e, { Router } from "express";
import {createExpense, deleteExpense, getExpense, getExpenseById, updateExpense} from "../controllers/expenseController.js";

const expenseRoutes = Router();

expenseRoutes.get("/", getExpense);

expenseRoutes.post("/", createExpense);

expenseRoutes.get("/",getExpenseById);

expenseRoutes.delete("/",deleteExpense);

expenseRoutes.update("",updateExpense);

export default expenseRoutes;