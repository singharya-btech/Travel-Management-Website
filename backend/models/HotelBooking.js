const mongoose = require('mongoose');

const hotelBookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'HotelListing' },
    CheckIn: Date,
    CheckOut: Date,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HotelBooking', hotelBookingSchema);