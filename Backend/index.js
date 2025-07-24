import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";

dotenv.config();

connectDB();

const app= express();
app.get("/", (req,res)=>{
res.send("Main server start");
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`);
})