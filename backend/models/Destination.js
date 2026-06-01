const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    destinationName: {type: String,required: true},
    country: {type: String,required: true},
    description: {type: String,required: true},
    price: {type: Number,required: true},
    days: {type: Number,required: true},
    image: {type: String,required: true}
});



module.exports = mongoose.model('Destination', destinationSchema);
