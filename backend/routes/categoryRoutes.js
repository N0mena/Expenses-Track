import express from "express"
import { createDefaultCategories,createCategory,deleteCategoryId,updateCategoryId,getAllCategories,getCategoryById } from "../controllers/categoryController.js"

const categoryRoutes =  express.Router();

categoryRoutes.post("/",createCategory)

categoryRoutes.post("/",createDefaultCategories)

categoryRoutes.get("/",getAllCategories)

categoryRoutes.get("/",getCategoryById)

categoryRoutes.put("/",updateCategoryId)

categoryRoutes.delete("/",deleteCategoryId)

export default categoryRoutes;