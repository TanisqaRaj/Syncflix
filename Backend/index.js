import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import youtubeRoutes from "./routes/youtube.js";

dotenv.config();

connectDB();


const app= express();
app.use(cors());
app.use(express.json());
app.get("/", (req,res)=>{
res.send("Main server start");
})

app.use("/api", youtubeRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`);
})