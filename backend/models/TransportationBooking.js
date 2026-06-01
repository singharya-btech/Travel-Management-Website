const mongoose = require('mongoose');

const transportationBookingSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId,ref: 'Register',required: true},
    transportationId: {type: mongoose.Schema.Types.ObjectId,ref: 'Transportation',required: true},
    passengers: {type: Number,required: true},
    totalAmount: {type: Number,required: true},
    bookingDate: {type: Date,default: Date.now}

});

module.exports = mongoose.model('TransportationBooking',transportationBookingSchema);
