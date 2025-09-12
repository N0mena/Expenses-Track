import { Router } from "express";
import {getAllIncomes, getIncomeById, updateIncome, deleteIncome, postNewIncome} from "../controllers/incomeController.js";
import { authenticateToken } from "../middleware/auth.js";

const incomeRoutes = Router();

incomeRoutes.use(authenticateToken);

incomeRoutes.get("/", getAllIncomes);

incomeRoutes.get("/:id", getIncomeById);

incomeRoutes.post("/", postNewIncome);

incomeRoutes.put("/:id", updateIncome);

incomeRoutes.delete("/:id", deleteIncome);

export default incomeRoutes;