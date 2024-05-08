const { RegistrationModel, BookingModel } = require("./Schema");


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



    const handleLogin = async (req, res) => {
        console.log(req.params);
        try {
          
          const { username, password } = req.params;
          console.log("Username:", username);
          console.log("Password:", password);
      
          const user = await RegistrationModel.findOne({ 
            username: username, 
            password: password 
        });
      
          if (user) {
            res.send(user.username); // Send username back to frontend
          } else {
            res.status(401).send("Login Failed"); // Send appropriate response if login fails
          }
        } catch (error) {
          console.error("Login error:", error);
          res.status(500).send("Internal Server Error");
        }
      };


      const handleBooking = async (req, res) => {
        console.log(req.body);
        
        const { selectedTime, selectedRooms, selectedOutDate, selectedInDate, username} = req.body;
      
        // Check if all required fields are present and not empty
        if (
          selectedTime?.length ||
          selectedRooms?.length ||
          selectedOutDate?.length ||
          selectedInDate?.length ||
          username?.length 
        
        ) {
          // Create a new booking entry in the database
          const dbResponse = await BookingModel.create({
            selectedTime,
            selectedRooms,
            selectedOutDate,
            selectedInDate,
            username,
           
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
      




module.exports = {
    handleRegistration,
    handleLogin,
    handleBooking
}