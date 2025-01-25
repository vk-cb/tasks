import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); 
const baseUrl = process.env.MONGODB_URI;
if (!baseUrl) {
    throw new Error("Environment variable MONGODB_URI is not defined");
  }
const db = async () => {
    
    try {
        await mongoose.connect(baseUrl)
        console.log('DB connected')
    } catch (error) {
        console.log(error)
    }
}
export default db
