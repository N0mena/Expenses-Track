
import express from "express";
import { signup, login, getMe } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);

authRoutes.post("/login", login);

authRoutes.get("/me", authenticateToken,getMe);

export default authRoutes;

