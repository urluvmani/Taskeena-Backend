import express, { Router } from 'express';
import {requiresignin,  isAdmin } from "../middleware/authMiddleware.js"
import { createCategoryController,updateCategoryController,deleteCategoryController,getCategoryController,getOneCategoryController } from '../controllers/categoryController.js';
const router = express.Router();

router.post("/create-category",requiresignin,isAdmin,createCategoryController)
router.put("/update-category/:id",requiresignin,isAdmin,updateCategoryController)
router.delete("/delete-category/:id",requiresignin,isAdmin,deleteCategoryController)
router.get("/get-category",getCategoryController)
router.get("/get-one-category/:slug",getOneCategoryController)
export default router;