import express from "express";
import path from 'path';
import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';
import cors from 'cors'

const app=express();

import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import postRouter from './routes/post.route.js'
import Notification from "./routes/notification.route.js"

import { connectMongoDb } from "./db/connectToMongoDb.js";

import cookieParser from "cookie-parser";

const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)

  }
  
app.use(cors(corsOptions));
  
const __dirname=path.resolve();

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
const PORT=process.env.PORT;

app.use(express.json({limit:'5mb'}));
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/post',postRouter);
app.use('/api/notification',Notification);
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'frontend/dist')));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'frontend','dist','index.html'));
    
    })
}
app.listen(PORT,()=>{
    console.log(`The port is listening at ${PORT}`);
    connectMongoDb();
})