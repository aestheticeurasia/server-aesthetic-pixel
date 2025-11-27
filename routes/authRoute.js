import express from 'express';
import formidable from 'express-formidable';
import { createUserController, deleteUserController, getAllUsersController, loginController } from '../controllers/authController.js';

//declare router
const router = express.Router();

//Create User Route
router.post("/create-user", formidable(), createUserController);

//Login Route
router.post("/login", formidable(), loginController);

//Get All Users
router.get("/all-users", getAllUsersController);

//delete single user
router.delete("/delete-user/:id", deleteUserController);

export default router;