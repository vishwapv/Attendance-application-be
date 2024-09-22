const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const RegistrationSchema = new Schema({
    userName: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true,
    }
})

module.exports = Registration = mongoose.model("registration", RegistrationSchema)