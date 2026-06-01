const mongoose = require('mongoose');


const hotelListingSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    location: String,
    image:[String],
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bookingDates: [{ start: Date, end: Date }],
    createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('HotelListing', hotelListingSchema);