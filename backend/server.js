import express from "express";
import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';


import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import postRouter from './routes/post.route.js'
import { connectMongoDb } from "./db/connectToMongoDb.js";

import cookieParser from "cookie-parser";

const app=express();
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
const PORT=process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/post',postRouter);
app.listen(PORT,()=>{
    console.log(`The port is listening at ${PORT}`);
    connectMongoDb();
})