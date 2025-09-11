import { Router } from "express";
import { getDashboard, getExpensesByCategory, getMonthlyTrend } from "../controllers/dashboardController.js";
import { authenticateToken } from "../middleware/auth.js";

const dashboardRoutes = Router();


dashboardRoutes.use(authenticateToken);


dashboardRoutes.get("/", getDashboard);

dashboardRoutes.get("/categories", getExpensesByCategory);

dashboardRoutes.get("/trend", getMonthlyTrend);

export default dashboardRoutes;