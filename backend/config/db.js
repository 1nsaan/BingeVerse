import mongoose from "mongoose";
import { ENV_VARS } from "./envVars.js";

export const connectDb = async ()=>{
    try {
        const conn = await mongoose.connect(ENV_VARS.MONGO_URI)
        console.log("Connected to DB");
    
    } catch (error) {
        console.log("Error");
        process.exit(1);
    }
}