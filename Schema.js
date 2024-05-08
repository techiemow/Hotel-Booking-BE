const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RegistrationSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    emailaddress: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }
   

})

const BookingSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    selectedInDate:{
        type: String,
        required: true
    },
    selectedOutDate:{
        type: String,
        required: true
    },
    selectedRooms:{
        type: Number,
        required: true
    },
    selectedTime: {
        type: String,
        required: true
    },
    Price :{
        type: Number,
        required: true
    },
    isCancelled: { type: Boolean }
    
}
)


const BookingModel = mongoose.model("MyBookings", BookingSchema)


const RegistrationModel = mongoose.model('Registrations', RegistrationSchema);

module.exports= {
    BookingModel,
    RegistrationModel
}
