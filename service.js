const { RegistrationModel } = require("./Schema");


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







module.exports = {
    handleRegistration,
    handleLogin
}