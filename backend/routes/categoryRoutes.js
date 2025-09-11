import express from "express"
import { createDefaultCategories,createCategory,deleteCategoryId,updateCategoryId,getAllCategories,getCategoryById } from "../controllers/categoryController.js"

const router =  express.Router();

router.post("/",createCategory)

router.post("/",createDefaultCategories)

router.get("/",getAllCategories)

router.get("/",getCategoryById)

router.put("/",updateCategoryId)

router.delete("/",deleteCategoryId)

export default router;