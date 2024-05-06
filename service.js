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

module.exports = {
    handleRegistration
}