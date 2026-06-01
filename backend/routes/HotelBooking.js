const express = require('express');
const router = express.Router();
const hotelBooking = require('../models/HotelBooking');
const auth = require('../middleware/auth');

// Create a new hotel booking
router.post('/', auth, async (req, res) => {
    try {
        const{ hotelId, checkInDate, checkOutDate } = req.body;
        const newBooking = new hotelBooking({
            user: req.user.userId,
            hotel: hotelId,
            CheckIn: checkInDate,
            CheckOut: checkOutDate
        });
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all bookings for the authenticated user
router.get("my-bookings", auth, async (req, res) => {
    try {
        const bookings = await hotelBooking.find({ user: req.user.userId }).populate('hotel');
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific booking by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const booking = await hotelBooking.findById(req.params.id).populate('hotel');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

//Update a booking by ID
router.put('/:id', auth, async (req, res) => {
    try {
        const booking = await hotelBooking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const { checkInDate, checkOutDate } = req.body;
        booking.CheckIn = checkInDate || booking.CheckIn;
        booking.CheckOut = checkOutDate || booking.CheckOut;
        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }       
});

// Delete a booking by ID
router.delete('/:id', auth, async (req, res) => {
    try {
        const booking = await hotelBooking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }   
        await hotelBooking.deleteOne({ _id: req.params.id });
        res.json({ message: 'Booking deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;