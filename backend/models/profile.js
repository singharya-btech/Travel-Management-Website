const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    bio:String,
    phone:String,
    profilePicture:String,
    location:String,
    dob:String,
    createdAt:{type: Date, default: Date.now}
});


module.exports = mongoose.model('Profile', profileSchema);
