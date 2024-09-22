const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  mobile: {
    type: String,
    required: true,
    min: 10,
    max: 12
  },
  //if isActive 
  // => 0 -> means not verified
  // => 1 -> means account verified
  // => 2 -> means account blocked
  //3 => 3 -> means account deleted
  
  is_active: {
    type: Number,
    default: 0
  },
  confirmOtp: {
    type: String,
    required: false
  },
  otpTries: {
    type: Number, 
    required: false, 
    default: 0
  },
  acceptTOS: {
    type: Number,
    default: 0
  },
  acceptPP: {
    type: Number,
    default: 0
  },
  // video_watched: {
  //   type: Number
  // },
  profiles: [
    { 
      type: mongoose.Types.ObjectId, 
      ref: 'profile'
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }

});

UserSchema.index({mobile:1,is_active:1})
module.exports = User = mongoose.model("users", UserSchema);