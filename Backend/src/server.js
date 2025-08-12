// import express from 'express';
// const express = require('express');
import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import rateLimiter from "../middleware/rateLimiter.js";
import cors from 'cors';

dotenv.config();
const app = express();


app.use(cors({
    origin: 'http://localhost:5173',
}));  

// Middleware to parse JSON bodies

app.use(express.json()); 
app.use(rateLimiter); 
       


// Custom middleware 
// app.use((req,res,next) =>{
//     console.log(`Request Method : ${req.method}, Request URL: ${req.url}`);
//     next();
// })

app.use("/api/notes", notesRoutes);

connectDb().then( ()=>{
    app.listen(process.env.PORT, () => {
    console.log(`Server is Running on http://localhost:${process.env.PORT}`)
    })
})

