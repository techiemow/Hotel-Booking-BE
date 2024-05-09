const express = require("express");
const Razorpay = require('razorpay')
const cors = require("cors");
const { connectdb } = require("./db");
const bodyParser = require("body-parser");

const {handleRegistration, handleLogin, handleBooking, handleMyBooking,handleCancelBooking,handleReview } = require("./service");

const PORT = process.env.PORT || 4000;


const razorpay = new Razorpay({
    key_id: 'rzp_test_DClMygpDU9TijX', // Replace with your Razorpay key_id
    key_secret: 'ozspmFKoIn4xtZLmJsmXEVoR', // Replace with your Razorpay key_secret
  });
  

const app = express()
app.use(bodyParser.json())
app.use(cors ({

}))
connectdb();

app.get("/" , (req,res) =>{
    res.send("Welcome to BookHaven page")
})

app.post("/registration" , async(req,res) =>{
    handleRegistration(req, res)

})

app.get("/Login/:username/:password", async(req,res) =>{
  const { username, password } = req.params;

  try {
    const loginResult = await handleLogin(username, password);
    res.json(loginResult);
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(401).send("Login Failed: " + error.message);
  }

})

app.post("/create_booking", async(req,res) =>{
    handleBooking(req, res)
    
})

app.get("/mybookings/:username", async(req,res) =>{
    handleMyBooking(req, res)
    
})

app.put("/cancelBooking/:username/:bookingId", (req, res) => {
    handleCancelBooking(req, res);
  });

app.post("/Review" ,(req, res) =>{
  handleReview(req, res);


});


  app.post('/payment', async(req, res) => {
    const { amount, currency } = req.body;
  
    try {
      const order = await razorpay.orders.create({
        amount,
        currency,
        receipt: 'order_rcptid_11',
        payment_capture: 1,
      });
  
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });





app.listen(PORT,()=>{
    console.log("Server working Fine")
})