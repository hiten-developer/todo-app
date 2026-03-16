require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const todoRoutes = require('./routes/todoRoutes')


app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/todos',todoRoutes)

const PORT = process.env.PORT;
connectDB()

app.get('/', (req, res) => {
    res.send("API is Running...")
})

app.listen(PORT, () => {
    console.log("Server is Running...");

})