const express = require("express");
const Razorpay = require('razorpay')
const cors = require("cors");
const { connectdb } = require("./db");
const bodyParser = require("body-parser");
const { RegistrationModel,BookingModel } = require("./Schema");
const {ObjectId} = require("mongodb")

const {handleRegistration, handleLogin, handleBooking, handleMyBooking,handleCancelBooking,handleReview } = require("./service");

const PORT = process.env.PORT || 4000;


const razorpay = new Razorpay({
    key_id: 'rzp_test_DClMygpDU9TijX', // Replace with your Razorpay key_id
    key_secret: 'ozspmFKoIn4xtZLmJsmXEVoR', // Replace with your Razorpay key_secret
  });
  

const app = express()
app.use(bodyParser.json())
app.use(cors());



// Use the logRequest middleware for all routes
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Call next() to move to the next middleware or route handler
};


app.use(logRequest);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});


const verifyUser = async (username) => {
  const dbResponse = await  RegistrationModel.findOne({ username });
  if (dbResponse._id) {
    return true;
  }
  return false;
};

const authorization = (req, res, next) => {
  console.log(req.path, "req");

  if (req.path === "/Login/:username/:password"||"/registration"||"/cancelBooking/:username/:bookingId") {
    next();
  } else {
    const userToken = req.headers.auth;
    if (!userToken) {
      res.send(400);
    }
    const tokenDecoded = jwt.verify(userToken, "userkey");
    const username = tokenDecoded.data;

    verifyUser(username).then((response) => {
      if (response) {
        next();
      } else {
        res.send(400);
      }
    });
  }
};

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
  const { bookingId } = req.params;

  try {
    if (bookingId) {
      const filter = { _id: new ObjectId(bookingId) };
      const update = { payment: true };

      // Update the booking document to mark it as paid
      const dbResponse = await BookingModel.findOneAndUpdate(filter, update);

      if (dbResponse) {
        // Create Razorpay order
        const order = await razorpay.orders.create({
          amount,
          currency,
          receipt: 'order_rcptid_11',
          payment_capture: 1,
        });

        // Send the Razorpay order details as JSON response
        res.json(order);
      } else {
        // Booking not found or could not be updated
        res.status(404).json({ error: 'Booking not found or could not be updated' });
      }
    } else {
      // Invalid or missing bookingId parameter
      res.status(400).json({ error: 'Invalid or missing bookingId parameter' });
    }
  } catch (error) {
    // Handle any errors that occur during the payment process
    console.error('Payment error:', error.message);
    res.status(500).json({ error: 'Payment failed' });
  }
});





app.listen(PORT,()=>{
    console.log("Server working Fine")
})
