const mongoose = require('mongoose');
const myprocess  = require("dotenv").config()

const mongoDb = myprocess.parsed.MongoDB;

const connectdb = async() => {
    await mongoose.connect(mongoDb);
    console.log("connect db", mongoose.connection.readyState);
    if(mongoose.connection.readyState === 1){
        console.log("db connected");
    } else {
        console.log("db not connected");

    }
}

const connection = mongoose.connection;
connection.on('error', (error) => {
    console.error('Error connecting to MongoDB:', error);
  });
  
  connection.once('open', () => {
    console.log('Connected to MongoDB successfully!');
  });




module.exports = {
    connectdb,
    mongoose
}