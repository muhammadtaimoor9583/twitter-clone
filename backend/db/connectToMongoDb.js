import mongoose from "mongoose";

export const connectMongoDb=async()=>{
    try {
        const conn= await mongoose.connect(process.env.Mongo_URI);
        console.log('connected');
        
    } catch (error) {
        console.log('Error occured in connecting to mongodb');
    }
}