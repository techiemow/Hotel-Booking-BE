const express = require("express");
const cors = require("cors");
const { connectdb } = require("./db");
const bodyParser = require("body-parser");

const {handleRegistration,handleLogin} = require("./service");

const port = 4000;

const app = express()
app.use(bodyParser.json())
app.use(cors())
connectdb();

app.get("/" , (req,res) =>{
    res.send("Welcome to BookHaven page")
})

app.post("/registration" , async(req,res) =>{
    handleRegistration(req, res)

})

app.get("/Login/:username/:password", async(req,res) =>{
    handleLogin(req, res)

})








app.listen(port,()=>{
    console.log("Server working Fine")
})