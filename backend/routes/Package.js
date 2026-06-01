const express = require('express');
const router  = express.Router();
const Package = require('../models/Package');

// GET all packages
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'All' ? { category } : {};
    const packages = await Package.find(filter).sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single package
router.get('/:id', async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add package
router.post('/add', async (req, res) => {
  try {
    const pkg = new Package(req.body);
    await pkg.save();
    res.status(201).json({ message: 'Package added', package: pkg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update package
router.put('/update/:id', async (req, res) => {
  try {
    const updated = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Package updated', package: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE package
router.delete('/delete/:id', async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: 'Package deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
