import { Router } from "express";
import {createExpense, deleteExpense, getExpense, getExpenseById, updateExpense} from "../controllers/expenseController.js";
import { authenticateToken } from "../middleware/auth.js";

const expenseRoutes = Router();

expenseRoutes.use(authenticateToken)

expenseRoutes.get("/", getExpense);

expenseRoutes.post("/", createExpense);

expenseRoutes.get("/:id",getExpenseById);

expenseRoutes.delete("/:id",deleteExpense);

expenseRoutes.put("/:id",updateExpense);

export default expenseRoutes;