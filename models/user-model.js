const mongoose = require('mongoose');

const newUserSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required: true,
    },
    lastName:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
    },
    passwordHash:{
        type:String,
        required: true,
    },
    phoneNumber:{
        type:Number,
    }
})

const User = mongoose.model('User', newUserSchema);
module.exports = User;

