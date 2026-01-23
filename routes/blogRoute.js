import express from 'express';
import formidable from 'express-formidable';
import avatarUpload from '../config/multerS3Config.js';
import { requireSignIn, isAdmin, isModerator, isActive } from '../middlewares/authMiddleware.js';
import { createBlogController, deleteBlogController, getAllBlogsController, getSingleBlogController } from '../controllers/blogController.js';

//declare router
const router = express.Router();

//Create Blog Route
router.post("/create-blog", requireSignIn, isModerator, avatarUpload.single("coverPhoto"), createBlogController);

//Blog Routes
router.get("/get-all-blogs", requireSignIn, isActive, getAllBlogsController);

//get single blog
router.get("/get-blog/:slug", getSingleBlogController);

//delete blog
router.delete("/delete-blog/:id", requireSignIn, isAdmin, deleteBlogController);

export default router;