const express = require('express');
const app     = express();
const cors    = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes                = require('./routes/auth');
const profileRoutes             = require('./routes/profile');
const HotelListingRoutes        = require('./routes/Hotelisting');
const hotelBookingRoutes        = require('./routes/HotelBooking');
const packageBookingRoutes      = require('./routes/PackageBooking');
const destinationRoutes         = require('./routes/Destination');
const transportationRoutes      = require('./routes/Transportation');
const transportationBookingRoutes = require('./routes/TransportationBooking');
const wishlistRoutes            = require('./routes/wishlist');
const packageRoutes             = require('./routes/Package');

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',                    authRoutes);
app.use('/api/profile',                 profileRoutes);
app.use('/api/hotel-listings',          HotelListingRoutes);
app.use('/api/hotel-bookings',          hotelBookingRoutes);
app.use('/api/package-bookings',        packageBookingRoutes);
app.use('/api/destinations',            destinationRoutes);
app.use('/api/transportation',          transportationRoutes);
app.use('/api/transportation-bookings', transportationBookingRoutes);
app.use('/api/wishlist',                wishlistRoutes);
app.use('/api/packages',                packageRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', name: 'TravelBuddy API' }));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON payload' });
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('TravelBuddy Server running on port ' + PORT));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));
