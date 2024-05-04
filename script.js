const express = require("express")


const port = 4000;

const app = express()

app.get("/" , (req,res) =>{
    res.send("Welcome to BookHaven page")
})


app.get("/login", (req,res) =>
    res.send("Login Page")
)




app.listen(port,()=>{
    console.log("Server working Fine")
})