import express from 'express';
import formidable from 'express-formidable';
import avatarUpload from '../config/multerS3Config.js';
import { createUserController, deleteUserController, getAllUsersController, loginController, updatePasswordByUserController, updateAvatarbyUserController, updateUserByAdminController, loggedInUserController } from '../controllers/authController.js';
import { requireSignIn,isAdmin, isModerator } from '../middlewares/authMiddleware.js';

//declare router
const router = express.Router();

//Create User Route
router.post("/create-user", requireSignIn, isAdmin, avatarUpload.single("avatar"), createUserController);

//Login Route
router.post("/login", formidable(), loginController);

//get logged in user
router.get("/me", requireSignIn, loggedInUserController);

//Get All Users
router.get("/all-users", requireSignIn, getAllUsersController);

//update password by user
router.put("/update-password", requireSignIn, formidable(), updatePasswordByUserController);

//update avatar by user
router.put("/update-avatar", requireSignIn, avatarUpload.single("avatar"), updateAvatarbyUserController);

//update user by admin
router.put("/update-user/:id", requireSignIn, isAdmin, formidable(), updateUserByAdminController);

//delete single user
router.delete("/delete-user/:id", requireSignIn, isAdmin, deleteUserController);

export default router;