// import express from 'express';
// const express = require('express');
import express, { response } from "express";
import notesRoutes from "./routes/notesRoutes.js";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import rateLimiter from "../middleware/rateLimiter.js";
import cors from 'cors';
import path from 'path';
dotenv.config();
const app = express();
const __dirname = path.resolve()


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

// Production
app.use(express.static(path.join(__dirname,"../Frontend/dist")))

app.get("/*",(request,response) => {
    response.sendFile(path.join(__dirname,"../Frontend","dist","index.html"));
});

if(process.env.NODE_ENV === "production"){ 
    app.use(
        cors({
            origin: "http://localhost:5173",
        })
    );
}



connectDb().then( ()=>{
    app.listen(process.env.PORT, () => {
    console.log(`Server is Running on http://localhost:${process.env.PORT}`)
    })
})

