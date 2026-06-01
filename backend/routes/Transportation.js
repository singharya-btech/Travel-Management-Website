const express = require('express');
const router = express.Router();

const Transportation = require('../models/Transportation');


// Add transportation
router.post('/add', async (req, res) => {
    try {
        const transport = new Transportation(req.body);
        await transport.save();
        res.status(201).json({message: "Transportation Added",transport});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// Get all transportation
router.get('/', async (req, res) => {
    try {
        const transportList = await Transportation.find();
        res.json(transportList);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// Get single transportation
router.get('/:id', async (req, res) => {
    try {
        const transport = await Transportation.findById(req.params.id);
        res.json(transport);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


module.exports = router;