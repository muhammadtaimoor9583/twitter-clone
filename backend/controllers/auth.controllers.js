import validator from "validator";
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from "../lib/utilis/generateToken.js";
export const login=async(req,res)=>{
    const {username,password}=req.body;
    if(!username || !password){
        return res.status(400).json({error:"Please fill all the fields"})
    }
    const user=await User.findOne({username});
    const isMatch=await bcrypt.compare(password,user?user.password:"");
    if(!user || !isMatch){
        return res.status(401).json({error:"Invalid email or password"})
    }
    generateTokenAndSetCookie(user._id,res);
    res.json({message:"Logged in successfully"})
}
export const signup=async(req,res)=>{
    try{
    const {email,username,fullName:fullname,password}=req.body;
    if(!validator.isEmail(email)){
        console.log(`${Email} is not valid`);
        return res.status(400).json({error:"Email is not valid"});
    }
    if(password.length<8){
        console.log(`Password should be at least 8 characters`);
        return res.status(400).json({error:"Passwod is not strong"});
    }
    const existingEmail= await User.findOne({email});
    if(existingEmail){
        console.log(`Email already exists`);
        return res.status(400).json({error:"Email is already used"});
    }
    const existingName= await User.findOne({username});
    if(existingName){
        console.log(`Username is taken`);
        return res.status(400).json({error:"Username is taken"});
    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const newuser=new User({
        email,
        username,
        fullname,
        password:hashedPassword
        });

    
    if(newuser){
        generateTokenAndSetCookie(newuser._id,res);
        await newuser.save();
        res.status(201).json({
            id:newuser._id,
            username:newuser.username,
            email:newuser.email,
            following:newuser.following,
            followers:newuser.followers,
            profileImg:newuser.profileImg,
            bio:newuser.bio,
            coverImg:newuser.coverImg
        });
    }else{
        res.status(400).json({error:"Failed to create user"});
        }
}catch(error){
        console.log('Error in signup controller',error.message);
        res.status(500).json({error:"Internal server error"});

}
        

}
export const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge: 0 });
        res.status(200).json({message:"Logout successfully"});
    } catch (error) {
        console.log('Error in logout controller',error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export const getMe=async(req,res)=>{
    try {
        console.log('I will tell you who you are(auth or not auth');
        const user=await User.findById(req.user._id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        console.log('Error in getMe controller',error.message);
        res.status(500).json({error:"Internal server error"});
    }
}