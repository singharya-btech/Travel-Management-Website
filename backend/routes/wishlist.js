const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const Wishlist = require('../models/WishlistItem');

// GET /api/wishlist — get all wishlist items for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.userId }).sort({ addedAt: -1 });
    res.json(items);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/wishlist — add item
router.post('/', auth, async (req, res) => {
  const { refId, type, title, destinationName, image, location, price } = req.body;
  if (!refId || !type) {
    return res.status(400).json({ message: 'refId and type are required' });
  }
  try {
    const existing = await Wishlist.findOne({ user: req.user.userId, refId });
    if (existing) return res.status(409).json({ message: 'Already in wishlist' });

    const item = new Wishlist({
      user: req.user.userId,
      refId, type, title, destinationName, image, location, price
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/wishlist/:id — remove by wishlist item _id
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Wishlist.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Removed from wishlist' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/wishlist/ref/:refId — remove by original item refId
router.delete('/ref/:refId', auth, async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ refId: req.params.refId, user: req.user.userId });
    res.json({ message: 'Removed from wishlist' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/wishlist/check/:refId — check if item is in wishlist
router.get('/check/:refId', auth, async (req, res) => {
  try {
    const item = await Wishlist.findOne({ user: req.user.userId, refId: req.params.refId });
    res.json({ inWishlist: !!item, itemId: item?._id });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
