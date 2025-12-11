import express from 'express';
import formidable from 'express-formidable';
import avatarUpload from '../config/multerS3Config.js';
import { requireSignIn, isAdmin, isModerator, isActive } from '../middlewares/authMiddleware.js';
import { createBlogController } from '../controllers/blogController.js';

//declare router
const router = express.Router();

//Create Blog Route
router.post("/create-blog", requireSignIn, isModerator, avatarUpload.single("coverPhoto"), createBlogController);

export default router;