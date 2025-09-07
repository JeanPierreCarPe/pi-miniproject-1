const mongoose = require("mongoose");

  // Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:false,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:false,
    },
    birthDate:{
        type:Date,
        required:false,
    },
    age:{
        type:Number,
        validate: {
            validator: Number.isInteger,
        },
        required: false
    },
    image:{
        type:String,
        required:false,
    },
    isActive:{
    type:Boolean,
    default:true
    }
    
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('User', userSchema);