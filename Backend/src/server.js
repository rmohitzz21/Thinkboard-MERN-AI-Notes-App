// import express from 'express';
// const express = require('express');
import express from "express";
import notesRoutes from "./routes/notesRoutes.js";

import { connectDb } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "../middleware/rateLimiter.js";

dotenv.config();
const app = express();



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

