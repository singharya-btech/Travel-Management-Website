const express = require('express');
const router  = express.Router();
const Hotelist = require('../models/Hotelisting');
const auth     = require('../middleware/auth');


// GET all hotel listings (public)
router.get('/', async (req, res) => {
    try {
        const { location, minPrice, maxPrice, amenities } = req.query;
        const filter = {};
        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = +minPrice;
            if (maxPrice) filter.price.$lte = +maxPrice;
        }
        if (amenities) {
            filter.amenities = { $all: amenities.split(',') };
        }
        const listings = await Hotelist.find(filter).sort({ createdAt: -1 });
        res.json(listings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// GET hotel listing by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const listing = await Hotelist.findById(req.params.id);
        if (!listing) return res.status(404).json({ message: 'Hotel listing not found' });
        res.json(listing);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// POST add hotel — admin-accessible (no auth required so admin dashboard can use it)
router.post('/add', async (req, res) => {
    try {
        const newListing = new Hotelist(req.body);
        const saved = await newListing.save();
        res.status(201).json(saved);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// POST add hotel by authenticated host
router.post('/', auth, async (req, res) => {
    try {
        const newListing = new Hotelist({ ...req.body, hostId: req.user.userId });
        const saved = await newListing.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// PUT update hotel listing by ID (auth required)
router.put('/:id', auth, async (req, res) => {
    try {
        const listing = await Hotelist.findById(req.params.id);
        if (!listing) return res.status(404).json({ message: 'Hotel listing not found' });
        const updated = await Hotelist.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// DELETE hotel listing by ID (public for admin dashboard)
router.delete('/delete/:id', async (req, res) => {
    try {
        await Hotelist.findByIdAndDelete(req.params.id);
        res.json({ message: 'Hotel listing deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// DELETE by ID (auth required for host)
router.delete('/:id', auth, async (req, res) => {
    try {
        const listing = await Hotelist.findById(req.params.id);
        if (!listing) return res.status(404).json({ message: 'Hotel listing not found' });
        await Hotelist.findByIdAndDelete(req.params.id);
        res.json({ message: 'Hotel listing deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
