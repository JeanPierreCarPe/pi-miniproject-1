const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    Title:{
        type:String,
        required:true,
        trim: true,
        maxlength: 50
    },
    detail:{
        type:String,
        required:false,
        trim: true,
        maxlength: 500
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
        enum: ['Por hacer', 'Haciendo', 'Hecho'],
        required:true,
        default: 'Por hacer'
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    isActive:{
    type:Boolean,
    default:true
    }

}, { timestamps: true });

userSchema.index({ ownerId: 1, initDate: 1 });

//Export the model
module.exports = mongoose.model('Task', userSchema);