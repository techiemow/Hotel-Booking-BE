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


const RegistrationModel = mongoose.model('Registrations', RegistrationSchema);

module.exports= {
    RegistrationModel
}
