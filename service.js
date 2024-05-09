const { RegistrationModel, BookingModel ,ReviewModel } = require("./Schema");
const {ObjectId} = require("mongodb")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const handleRegistration = async(req,res) =>{
    console.log(req.body)

    const {username,password,phoneNumber,emailaddress} = req.body;
    if(username?.length && 
        password?.length && 
         emailaddress?.length && 
        phoneNumber?.length )
        {
       
        const dbResponse = await RegistrationModel.create({
        username,
        emailaddress,
        password,
        phoneNumber
        
        })
        if (dbResponse?._id) {
            console.log("Created")
            res.send(dbResponse);
            return;
          }
        }
        res.send("Incorrect Data");
}



              const handleLogin = async (username, password) => {
                try {
                  // Find user by username
                  const user = await RegistrationModel.findOne({ username });

              
                  if (!user) {
                    throw new Error("User not found");
                  }

                  // Compare entered password with hashed password
                  const passwordMatch = await bcrypt.compare(password, user.password);

                  if (passwordMatch) {
                 
                    const token = jwt.sign({ data: username }, "userkey");
                    console.log(" token: " + token);
                    return { success: true, username: user.username , token: token};
                  } else {
                    throw new Error("Incorrect password");
                  }
                 

                } catch (error) {
                  throw new Error("Login failed");
                }
              };  


           
      const handleBooking = async (req, res) => {
        console.log(req.body);
        
        const { selectedTime, selectedRooms, selectedOutDate, selectedInDate, username , Price} = req.body;
      
        // Check if all required fields are present and not empty
        if (
          selectedTime?.length ||
          selectedRooms?.length ||
          selectedOutDate?.length ||
          selectedInDate?.length ||
          username?.length ||
          Price
        
        ) {
          // Create a new booking entry in the database
          const dbResponse = await BookingModel.create({
            selectedTime,
            selectedRooms,
            selectedOutDate,
            selectedInDate,
            username,
            Price,
            isCancelled: false
           
          });
      
          // Check if the database response contains a valid _id
          if (dbResponse?._id) {
            console.log("Booking Created Successfully");
            res.send(dbResponse);
            return;
          } else {
            console.log("Failed to create booking in the database");
            res.status(500).send("Failed to create booking");
          }
        } else {
          console.log("Required fields are missing or empty");
          res.status(400).send("Required fields are missing or empty");
        }
      };
      

    const handleMyBooking = async(req, res) => {
      const { username } = req.params;

      if (username?.length) {
        const dbResponse = await BookingModel.find({
          username
        });
    
        if (dbResponse) {
          res.send(dbResponse);
          return;
        }
      }
    
      res.send("cant fetch details");
    };


    const handleCancelBooking =  async(req, res) => {

      
        const { username, bookingId } = req.params;
      
        if (username?.length && bookingId?.length) {
          const filter = {
            _id: new ObjectId(bookingId),
          };
          const update = { isCancelled: true };
          const dbResponse = await BookingModel.findOneAndUpdate(filter, update);
      
          if (dbResponse) {
            res.send("Cancelled Success");
            return;
          }
        }
        res.send("Cancelled Failed");
      };
    
      const handleReview = async (req, res) => {
        try {
          console.log("Review", req.body);
          
          const { username, rating, review } = req.body; // Adjusted field name to 'rating' based on your React form
          if (!username || !review) {
            console.log("Required fields are missing or empty");
            return res.status(400).send("Required fields (username, review) are missing or empty");
          }
      
          // Create a new review instance
          const reviewRes = await ReviewModel.create({ username, rating, review });
      
          if (reviewRes) {
            console.log("Review has been posted:", reviewRes);
            return res.status(201).send(reviewRes); // HTTP 201 Created
          } else {
            console.log("Failed to create review in the database");
            return res.status(500).send("Failed to create review");
          }
        } catch (error) {
          console.error("Error creating review:", error.message);
          return res.status(500).send("Internal Server Error");
        }
      };

    




module.exports = {
    handleRegistration,
    handleLogin,
    handleBooking,
    handleMyBooking,
    handleCancelBooking,
    handleReview
    
}