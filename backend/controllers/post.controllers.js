import {v2 as cloudinary} from 'cloudinary'

import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';

export const createPost=async (req,res)=>{
    const {text}=req.body;
    let {img}=req.body;
    const userId= req.user._id;
    try {
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        if(!text && !img){
            return res.status(400).json({message:"Please provide text or image"})
        }
        if(img){
            const result=await cloudinary.uploader.upload(img);
            img=result.secure_url;
        }
        const post=new Post({
           user:userId,
           text,
           img 
        })

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.log("Error in createPost controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }

}

export const getAllPosts=async(req,res)=>{
    try {
        const posts=await Post.find().sort({createdAt : -1}).populate({
            path:"user",
            select:'-password'
        }).populate({
            path:"comments.user",
            select:'-password'
        });
        if(!posts){
            return res.status(200).json([])
        }
        res.status(200).json(posts);
        
    } catch (error) {
        console.log("Error in getAllPosts controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
        
    }
}

export const likeUnlikePost=async (req,res)=>{
    const {id}=req.params;
    const userId=req.user._id;
    try {
        const user=await User.findById(userId);
        const post=await Post.findById(id);
        if(!post){
            return res.status(400).json({message:'Post not found'});
        }
        const alreadyLiked=post.likes.includes(userId);
        if(alreadyLiked){
            //unlike the post
            await Post.updateOne({_id:id},{$pull:{likes:userId}});
            await User.updateOne({_id:userId},{$pull:{likedPosts:id}});

            post.likes=post.likes.filter((like)=> like.toString() !== userId.toString());
            const updatedLikes=post.likes;
            
            res.status(200).json(updatedLikes);
        }
        else{
            //like the post
            await post.likes.push(userId);
            await User.updateOne({_id:userId},{$push:{likedPosts:id}});

            await post.save();
            const notification=new Notification({
                from:userId,
                to:post.user,
                type:'like'
            });
            await notification.save();
            const updatedLikes=post.likes;
            res.status(200).json(updatedLikes);
        }

        
    } catch (error) {
        console.log("Error in likeUnlikePost controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
        
    }
}




export const deletePost=async(req,res)=>{
    const {id}=req.params;
    try {
        const post= await Post.findById(id);
        if(!post){
            return res.status(404).json({message:"Post not found"})
        }
        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({message:"Unauthorized to delete this post"})
        }
        if(post.img){
            post.img = (post.img).split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(post.img);
        }
        await  Post.findByIdAndDelete(id);
        res.status(200).json({message:"Post deleted successfully"}); 
    } catch (error) {
        console.log("Error in deletePost controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
        
    }
}

export const commentOnPost=async (req,res)=>{
    const {id}=req.params;
    const {text}=req.body;
    const userId=req.user._id;
    try {
        
        const post=await Post.findById(id);
        if(!post){
            return res.status(404).json({message:"Post not found"})
        }
        if(!text){
            return res.status(400).json({message:"Comment cannot be empty"})
        }
        const comment={user:userId,text};
        post.comments.push(comment);
        await post.save();
        const updatedComments=post.comments;
        res.status(200).json(updatedComments);

    } catch (error) {
        console.log("Error in commentOnPost controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
        
    }
}


export const getLikedPosts=async(req,res)=>{
    const {id:userId}=req.params;
    try {
        console.log(userId)
        const user=await User.findById(userId);
        const likedPosts=await Post.find({_id:{$in: user.likedPosts}})
        .populate({
            path:'user',
            select:'-password'
        })
        .populate({
            path:'comments.user',
            select:'-password'
        })

        res.status(200).json(likedPosts)
    } catch (error) {
        console.log("Error in getLikedPosts controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }

}


export const getFollowingPosts=async(req,res)=>{
    const userId=req.user._id;
    try {
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const followings=user.followings;
        const feedPosts=await Post.find({user:{$in:followings}})
        .populate({
            path:'user',
            select:'-password'
        })
        .populate({
            path:'comments.user',
            select:'-password'
        })
        res.status(200).json(feedPosts);
    } catch (error) {
        console.log("Error in getFollowingPosts controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
        
    }
}

export const getUserPosts=async(req,res)=>{
    const {username}=req.params;
    try {
        const user=await User.findOne({username});
        if(!user){
            return res.status(404).json({message:"User not found"})
            }

        const userPosts=await Post.find({user:user._id})
        .populate({
            path:'user',
            select:'-password'
        })
        .populate({
            path:'comments.user',
            select:'-password'
        });
        res.status(200).json(userPosts);

    } catch (error) {
        console.log("Error in getUserPosts controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}