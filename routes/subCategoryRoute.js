import express from 'express';
import formidable from 'express-formidable';
import { createSubCategoryController, deleteSubCategoryController, getAllSubCategoriesController, getSubCategoriesByParentController, updateSubCategoryController } from '../controllers/subCategoryController.js';
import { requireSignIn, isAdmin, isModerator } from '../middlewares/authMiddleware.js';

//declare router
const router = express.Router();

//Create Sub Category
router.post("/create-sub-category", requireSignIn, isAdmin, formidable(), createSubCategoryController);

//Get All Sub Categories
router.get("/get-all-sub-categories", getAllSubCategoriesController);

//get sub category by parent
router.get("/by-parent", getSubCategoriesByParentController);

//update sub category
router.put("/update-sub-category/:id", requireSignIn, isAdmin, formidable(), updateSubCategoryController);

//delete single sub category
router.delete("/delete-sub-category/:id", requireSignIn, isAdmin, deleteSubCategoryController);

export default router;