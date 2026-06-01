const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  refId: { type: mongoose.Schema.Types.ObjectId, required: true },
  type:  { type: String, enum: ['hotel', 'destination', 'package'], required: true },
  // Snapshot fields so wishlist looks good without extra DB joins
  title:            String,
  destinationName:  String,
  image:            mongoose.Schema.Types.Mixed, // String or [String]
  location:         String,
  price:            Number,
  addedAt: { type: Date, default: Date.now }
});

// One item per user per ref
wishlistItemSchema.index({ user: 1, refId: 1 }, { unique: true });

module.exports = mongoose.model('WishlistItem', wishlistItemSchema);
