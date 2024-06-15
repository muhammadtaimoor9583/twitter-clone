import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

export const protectRoute=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
    if (!token){
        return res.status(401).json({error: 'No token provided'});
    }
    const decoded= jwt.verify(token,process.env.SECRET_KEY?process.env.SECRET_KEY:'');

    if(!decoded){
        return res.status(401).json({error: 'Invalid token'});
    }
    const user=await User.findById(decoded.userId).select('-password');
    if (!user){
        return res.status(401).json({error: 'User not found'});
    }
    req.user=user;
    next();
}catch(error){
    console.log(error.message)
    return res.status(401).json({error: 'Middle ware function failed'});

}
}