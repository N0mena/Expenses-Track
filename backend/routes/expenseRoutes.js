import { Router } from "express";
import {createExpense, getExpense} from "../controllers/expenseController.js";

const expenseRoutes = Router();

expenseRoutes.get("/", getExpense);

expenseRoutes.post("/", createExpense);

export default expenseRoutes;