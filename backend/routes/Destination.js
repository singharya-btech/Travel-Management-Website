const express = require('express');
const router = express.Router();

const Destination = require('../models/Destination');

// Add destination
router.post('/add', async (req, res) => {
    try {
        const destination = new Destination(req.body);
        await destination.save();
        res.status(201).json({message: "Destination Added Successfully",destination});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// Get all destinations
router.get('/', async (req, res) => {
    try {
        const destinations = await Destination.find();
        res.json(destinations);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// Get single destination
router.get('/:id', async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        res.json(destination);
    } catch (error) {
        res.status(500).json({error: error.message});
        }
    });


// Update destination
router.put('/update/:id', async (req, res) => {
    try {
        const updatedDestination = await Destination.findByIdAndUpdate(req.params.id,req.body,{ new: true });
        res.json({message: "Destination Updated",updatedDestination});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// Delete destination
router.delete('/delete/:id', async (req, res) => {
    try {
        await Destination.findByIdAndDelete(req.params.id);
        res.json({message: "Destination Deleted"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;