const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CreateUserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true, // Ensure usernames are unique
    },
    dateOfBirth: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    aadharNumber: {
        type: String,
        required: true,
        // unique: true, // Ensure Aadhar numbers are unique
        validate: {
            validator: function (v) {
                return /^\d{12}$/.test(v); // Basic validation for Aadhar number (12 digits)
            },
            message: props => `${props.value} is not a valid Aadhar number!`
        }
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the created date to now
    },
    age: {
        type: Number,
        min: 0, // Ensure age is a positive number
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'], // Define allowed values for gender
        required: true,
    },
});

module.exports = CreateUsers = mongoose.model("createuser", CreateUserSchema)