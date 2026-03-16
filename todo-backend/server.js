require('dotenv').config()  
const express = require('express')
const app = express()
const connectDB = require('./config/db')


app.use(express.json())

const PORT = process.env.PORT;
connectDB()

app.get('/',(req,res) =>{
    res.send("API is Running...")
})

app.listen(PORT,() =>{
    console.log("Server is Running...");
    
})