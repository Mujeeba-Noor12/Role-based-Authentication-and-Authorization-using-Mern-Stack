const mongoose = require('mongoose');
const Joi = require('joi');
const userSchema = mongoose.Schema({
    fullname:String,
    username:String,
    email:String,
    password: Joi.string()
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$'))
    .required(),
    role: { 
        type: String, 
        enum: ["user", "admin"], 
        default: "user"
      },
     
    
})

module.exports = mongoose.model("User", userSchema);
