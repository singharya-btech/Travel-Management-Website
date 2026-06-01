const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name:String,
    email:{type: String, unique: true},
    password:String,
    confirmPassword:String,
    isHost:{type: Boolean, default: false},
    gender:String
});


module.exports = mongoose.model('User', userSchema);