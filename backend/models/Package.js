const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  duration: { type: String, required: true },
  price:    { type: String, required: true },
  badge:    { type: String, default: 'New' },
  category: { type: String, default: 'Beach' },
  image:    { type: String, default: '' },
  highlights: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Package', packageSchema);
