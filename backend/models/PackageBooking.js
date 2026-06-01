const mongoose = require('mongoose');

const packageBookingSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId,ref: 'Register',required: true},
    destinationId: {type: mongoose.Schema.Types.ObjectId,ref: 'Destination',required: true},
    persons: {type: Number,required: true},
    totalAmount: {type: Number,required: true},
    bookingDate: {type: Date,default: Date.now}
});

module.exports = mongoose.model('PackageBooking', packageBookingSchema);