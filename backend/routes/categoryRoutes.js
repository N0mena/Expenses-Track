import express from "express"
import { createDefaultCategories,createCategory,deleteCategoryId,updateCategoryId,getAllCategories,getCategoryById } from "../controllers/categoryController.js"
import { authenticateToken } from "../middleware/auth.js";

const categoryRoutes =  express.Router();

categoryRoutes.use(authenticateToken)

categoryRoutes.use(authenticateToken);

categoryRoutes.post("/",createCategory)

categoryRoutes.get("/",getAllCategories)

categoryRoutes.get("/:id",getCategoryById)

categoryRoutes.put("/:id",updateCategoryId)

categoryRoutes.delete("/:id",deleteCategoryId)

export default categoryRoutes;