import express from "express";
const router=express.Router();
import { protectRoute } from "../middleware/protectedRoute.js";
import {getUserProfile,followUnfollowUser,updateUser,getSuggestedUser} from "../controllers/user.controllers.js";

router.get('/profile/:username',getUserProfile);
router.post('/follow/:id',protectRoute,followUnfollowUser);
router.get('/suggested',protectRoute,getSuggestedUser);
router.post('/update',protectRoute,updateUser);
export default router;