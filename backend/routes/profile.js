const express = require('express');
const router = express.Router();
const Profile = require('../models/profile');
const auth = require('../middleware/auth');


// Get user profile
router.get('/', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.userId });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


//Post user profile
router.post('/', auth, async (req, res) => {
    try {
        const profileData = { user: req.user.userId, ...req.body };
        const existingProfile = await Profile.findOne({ user: req.user.userId });
        if (existingProfile) {
            return res.status(400).json({ message: 'Profile already exists' });
            }
        const profile = new Profile(profileData);
        await profile.save();
        res.status(201).json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Update user profile
router.put('/', auth, async (req, res) => {
    try {
        const updateProfile = await Profile.findOneAndUpdate(
            { user: req.user.userId },
            { $set: req.body },
            { new: true }
        );
        if (!updateProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(updateProfile);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Delete user profile
router.delete('/', auth, async (req, res) => {
    try {
        const deleteProfile = await Profile.findOneAndDelete({ user: req.user.userId });
        if (!deleteProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;