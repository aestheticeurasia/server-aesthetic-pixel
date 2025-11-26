import express from 'express';
import formidable from 'express-formidable';
import { createUserController, getAllUsersController, loginController } from '../controllers/authController.js';

//declare router
const router = express.Router();

//Create User Route
router.post("/create-user", formidable(), createUserController);

//Login Route
router.post("/login", formidable(), loginController);

//Get All Users
router.get("/all-users", getAllUsersController);

export default router;