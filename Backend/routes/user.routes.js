import express from "express";
import { register, login, logout } from "../controllers/user.controller.js";
import { SingleUpload } from "../middlewares/multer.js";

const router = express.Router();

// Register user with optional profile photo
router.post("/register", SingleUpload, register);

// Login user
router.post("/login", login);

// Logout user
router.get("/logout", logout);

export default router;
