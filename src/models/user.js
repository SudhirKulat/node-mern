const mongoose = require("mongoose");
const validator = require('validator');

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 20
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error ("Invalid emailId")
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error ("Please enter strong password")
      }
    }
  },
  age: {
    type: Number,
    min: 18
  },
  gender: {
    type: String,
    validate(value){
      if(!["male", "female","others"].includes(value)){
        throw new Error ("Invalid gender type")
      }
    }
  },
  photoURL:{
    type: String,
    validate(value){
      if(!validator.isURL(value)){
        throw new Error ("Invalid photo url")
      }
    }
  },
  skills: {
    type: [String],
    validate(value){
      if(value?.length > 5){
        throw new Error ("Can not add more than 5 skills")
      }
    }
  },
  about:{
    type: String,
    default: "This is my default info"
  }
}, { timestamps: true});
const User = mongoose.model("User", userSchema);
module.exports = User;
