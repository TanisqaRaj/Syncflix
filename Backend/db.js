import mongoose, { mongo } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.DB_url);
        console.log("MongoDB connected");
    }catch(err){
        console.error("Error connecting to MongoDB:",err.message);
        process.exit(1);
    }
}
export default connectDB;