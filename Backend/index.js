import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import youtubeRoutes from "./routes/youtube.js";
import AuthRoute from "./routes/AuthRoute.js"

dotenv.config();
connectDB();

const app= express();
app.use(express.json());
app.use(cors());
app.get("/", (req,res)=>{
res.send("Main server start");
})
app.use("/auth",AuthRoute);
app.use("/api", youtubeRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`);
})