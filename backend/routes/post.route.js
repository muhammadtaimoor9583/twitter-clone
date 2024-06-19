import express from "express";
const router=express.Router();
import { protectRoute } from "../middleware/protectedRoute.js";
import { createPost,
        likeUnlikePost,
        commentOnPost,
        deletePost, 
        getAllPosts, 
        getFollowingPosts, 
        getLikedPosts, 
        getUserPosts } from "../controllers/post.controllers.js";

router.get('/all',protectRoute,getAllPosts);
router.get('/likes/:id',protectRoute,getLikedPosts);
router.get('/feedPosts',protectRoute,getFollowingPosts);
router.get('/user/:username',protectRoute,getUserPosts);

router.post('/create',protectRoute,createPost);
router.post('/like/:id',protectRoute,likeUnlikePost);
router.post('/comment/:id',protectRoute,commentOnPost);
router.delete('/:id',protectRoute,deletePost);
export default router;