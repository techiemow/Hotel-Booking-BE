const express = require("express");
const Razorpay = require('razorpay')
const cors = require("cors");
const { connectdb } = require("./db");
const bodyParser = require("body-parser");
const { RegistrationModel,BookingModel } = require("./Schema");
const {ObjectId} = require("mongodb")
const jwt = require("jsonwebtoken")

const crypto = require("crypto")
const {handleRegistration, handleLogin, handleBooking, handleMyBooking,handleCancelBooking,handleReview } = require("./service");
const mongoose = require(`mongoose`)

const PORT = process.env.PORT || 4000;


const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,// Replace with your Razorpay key_id
    key_secret:process.env.RAZORPAY_SECRET_KEY, // Replace with your Razorpay key_secret
  });
  

const app = express()
app.use(bodyParser.json())
app.use(cors());



// Use the logRequest middleware for all routes
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); 
};

console.log("secert key",process.env.JWT_SECRET_KEY);


app.use(logRequest);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});


const verifyUser = async (username) => {
  try {
    const dbResponse = await RegistrationModel.findOne({ username });
     console.log(dbResponse);
     
    return dbResponse ? true : false;
  } catch (error) {
    console.error("Error verifying user:", error);
    return false;
  }
};

const authorization = async (req, res, next) => {
  console.log(req.path, "req");

  // Allow these paths without authentication
  if (req.path.startsWith("/Login") || req.path === "/registration" || req.path.startsWith("/cancelBooking")) {
    return next();
  }

  // Extract token from headers
  const userToken = req.headers['auth']; 

  if (!userToken) {
    return res.status(401).send("Authorization token is missing.");
  }

  try {
    // Verify the token
    const tokenDecoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);
    const username = tokenDecoded.data;

    // Verify user existence
    const isUserValid = await verifyUser(username);
    if (isUserValid) {
      return next();
    } else {
      return res.status(401).send("Invalid user.");
    }
  } catch (error) {
    console.error("Error in authorization middleware:", error);
    return res.status(401).send("Invalid token.");
  }
};

// Use the authorization middleware
app.use(authorization);



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
    res.send(loginResult);
    console.log(loginResult)
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



app.post('/payment/:bookingId', async (req, res) => {
  const { amount, currency } = req.body;

  try {
  
        // Create Razorpay order
        const order = await razorpay.orders.create({
          amount,
          currency,
          receipt: 'order_rcptid_11',
          payment_capture: 1,
        });

        res.json(order);
 
      }
    catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Payment failed' });
    }
 
  }
);



app.post("/payment/verify/:orderId" ,async(req,res) =>{

  const { paymentId , signature, bookingId }= req .body
  const { orderId } = req.params;
 


  try {
    // Verify payment signature
    const generatedSignature = crypto.createHmac('sha256', 'ozspmFKoIn4xtZLmJsmXEVoR')
      .update(`${orderId}|${paymentId}`)
      .digest('hex');


    if (generatedSignature === signature) {
      const filter = { _id: new mongoose.Types.ObjectId(bookingId) };
      const update = { payment: true }; 


      

      const dbResponse = await BookingModel.findOneAndUpdate(filter, update);

      console.log(dbResponse);

      if (dbResponse) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Booking not found or could not be updated' });
      }
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Payment verification error:', error.message);
    res.status(500).json({ error: 'Payment verification failed' });
  }












})





app.listen(PORT,()=>{
    console.log("Server working Fine")
})
