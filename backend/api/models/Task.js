const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    Title:{
        type:String,
        required:true,
    },
    detail:{
        type:String,
        required:false,
    },
    initDate:{
        type:Date,
        required:true,
    },
    endDate:{
        type:Date,
        required:false,
    },
    stageName:{
        type:String,
        enum: ['backlog', 'doing', 'done'],
        match: /^[a-zA-Z]+$/,
        required:true,
        default: 'backlog'
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive:{
    type:Boolean,
    default:true
    }

}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Task', userSchema);