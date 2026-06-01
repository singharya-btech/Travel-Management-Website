const express = require('express');
const router = express.Router();

const PackageBooking = require('../models/PackageBooking');


// Book a package
router.post('/book', async (req, res) => {
    try {
        const booking = new PackageBooking(req.body);
        await booking.save();
        res.status(201).json({message: "Package Booked Successfully",booking});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// Get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await PackageBooking.find().populate('userId').populate('destinationId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Get single booking
router.get('/:id', async (req, res) => {
    try {
        const booking = await PackageBooking.findById(req.params.id).populate('userId').populate('destinationId');
        res.json(booking);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// Delete booking
router.delete('/delete/:id', async (req, res) => {
    try {
        await PackageBooking.findByIdAndDelete(req.params.id);
        res.json({message: "Booking Deleted Successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;