const mongoose = require('mongoose');

const transportationSchema = new mongoose.Schema({
    transportType: {type: String,required: true},
    companyName: {type: String,required: true},
    source: {type: String,required: true},
    destination: {type: String,required: true},
    departureTime: {type: String,required: true},
    arrivalTime: {type: String,required: true},
    price: {type: Number,required: true},
    seatsAvailable: {type: Number,required: true}
});

module.exports = mongoose.model('Transportation',transportationSchema);