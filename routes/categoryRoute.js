import express from 'express';
import formidable from 'express-formidable';
import { createCategoryController, deleteCategoryController, getAllCategoriesController, getCategoriesWithSubsController, updateCategoryController } from '../controllers/categoryController.js';
import { requireSignIn, isAdmin, isModerator } from '../middlewares/authMiddleware.js';

//declare router
const router = express.Router();

//Create Category
router.post("/create-category", requireSignIn, isAdmin, formidable(), createCategoryController);

//Update Category
router.put("/update-category/:id", requireSignIn, isAdmin, formidable(), updateCategoryController);

//Get All Categories
router.get("/get-all-categories", getAllCategoriesController);

//get categoeis with subcategories
router.get("/categories-with-subcategories", getCategoriesWithSubsController);

//delete single category
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategoryController);

export default router;