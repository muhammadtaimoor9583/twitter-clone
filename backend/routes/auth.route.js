import express from "express";
const router=express.Router();
import { getMe,login,signup,logout } from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/protectedRoute.js";

router.get('/me',protectRoute,getMe);
router.post('/login',login);
router.post('/signup',signup);
router.post('/logout',logout);

export default router;