import { Router } from "express";
import { getMonthlySummary, getCustomSummary, getBudgetAlerts } from "../controllers/dashboardController.js ";
import { authenticateToken } from "../middleware/auth.js";

const summaryRoutes = Router();

summaryRoutes.use(authenticateToken);

summaryRoutes.get("/monthly", getMonthlySummary);

summaryRoutes.get("/alerts", getBudgetAlerts);

summaryRoutes.get("/", getCustomSummary);

export default summaryRoutes;