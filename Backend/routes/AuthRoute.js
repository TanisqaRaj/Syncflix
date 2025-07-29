import express from "express";
import { userSignup, loginUser } from "../controllers/AuthController.js";
const router = express.Router();

router.post("/signup/user", userSignup);
router.post("/login", loginUser);

export default router;
