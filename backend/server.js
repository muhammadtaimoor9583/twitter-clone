import express from "express";
import dotenv from 'dotenv';

import authRouter from './routes/auth.route.js'
import { connectMongoDb } from "./db/connectToMongoDb.js";

const app=express();
dotenv.config();
const PORT=process.env.PORT;
app.use(express.json());
app.use('/api',authRouter);

app.listen(PORT,()=>{
    console.log(`The port is listening at ${PORT}`);
    connectMongoDb();
})