const express = require("express");
const { connectdb } = require("./db");


const port = 4000;

const app = express()

app.get("/" , (req,res) =>{
    res.send("Welcome to BookHaven page")
})

connectdb();






app.listen(port,()=>{
    console.log("Server working Fine")
})