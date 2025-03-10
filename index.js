const express = require("express")
const cors = require("cors")
require("dotenv").config()
const connection = require('./connection/conn')
const PORT = process.env.PORT
const app = express()
const apirouter = require('./routes/user')
const apitasks = require('./routes/task')
app.use(cors())
app.use(express.json())
connection()

app.use('/api/v1', apirouter)
app.use('/api/v2', apitasks)

//http://localhost:8000/api/v1/sign_up

app.get("/", (req, res) => {
    res.send("Server is running")
})
app.listen(PORT, () => {
    console.log("server is connceted")
})