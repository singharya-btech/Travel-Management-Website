const express = require('express');
const router = express.Router();

const TransportationBooking = require('../models/TransportationBooking');


// Book transportation
router.post('/book', async (req, res) => {
    try {
        const booking = new TransportationBooking(req.body);
        await booking.save();
        res.status(201).json({message: "Transport Booked Successfully",booking});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// Get bookings for a user
router.get('/', async (req, res) => {
    try {
        const bookings = await TransportationBooking.find().populate('userId').populate('transportationId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;