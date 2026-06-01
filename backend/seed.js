/**
 * TravelBuddy — Seed Script
 * Run: node seed.js
 * This adds sample Destinations, Hotels and Packages to MongoDB.
 * Safe to run multiple times — it skips if data already exists.
 */
require("dotenv").config();
const mongoose  = require("mongoose");
const Destination = require("./models/Destination");
const HotelListing = require("./models/Hotelisting");
const Package   = require("./models/Package");

const DESTINATIONS = [
  {
    destinationName: "Marina Beach",
    country: "India",
    description: "The longest urban beach in Asia, stretching 13 km along Chennai's coast. Famous for its golden sand, the iconic lighthouse, and breathtaking sunrises that attract thousands of visitors every morning.",
    price: 500,
    days: 1,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Marina_Beach_in_Chennai.jpg/1200px-Marina_Beach_in_Chennai.jpg",
  },
  {
    destinationName: "Kapaleeshwarar Temple",
    country: "India",
    description: "A stunning 7th-century Dravidian-style temple dedicated to Lord Shiva, located in the heart of Chennai's Mylapore neighbourhood. The towering gopuram (gateway tower) is adorned with hundreds of colourful sculptures.",
    price: 300,
    days: 1,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kapaleeshwarar_Temple.jpg/1200px-Kapaleeshwarar_Temple.jpg",
  },
  {
    destinationName: "Mahabalipuram Shore Temple",
    country: "India",
    description: "A UNESCO World Heritage Site and one of the oldest structural stone temples in South India. Built by the Pallava dynasty in the 8th century, the temple complex sits dramatically on the shore of the Bay of Bengal.",
    price: 800,
    days: 2,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Shore_Temple_2.jpg/1200px-Shore_Temple_2.jpg",
  },
  {
    destinationName: "Valluvar Kottam",
    country: "India",
    description: "A grand memorial dedicated to the classical Tamil poet Thiruvalluvar, featuring a magnificent chariot carved from a single rock and an auditorium that can seat over 4,000 people.",
    price: 200,
    days: 1,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Valluvar_Kottam_Chennai.JPG/1200px-Valluvar_Kottam_Chennai.JPG",
  },
];

const HOTELS = [
  {
    title: "The Leela Palace Chennai",
    description: "An iconic luxury hotel offering world-class amenities, breathtaking views of the Bay of Bengal, and exceptional service. Features multiple fine-dining restaurants, a full-service spa, and an infinity pool.",
    price: 12000,
    location: "Chennai, Tamil Nadu",
    image: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80"],
  },
  {
    title: "ITC Grand Chola",
    description: "A magnificent LEED Platinum-certified hotel inspired by the grandeur of the Chola dynasty. Features 600 rooms and suites, 14 dining venues, and a stunning pool inspired by ancient temple tanks.",
    price: 8500,
    location: "Guindy, Chennai",
    image: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80"],
  },
  {
    title: "Taj Coromandel",
    description: "Chennai's most celebrated address for over five decades. Combining timeless elegance with modern luxury in the heart of Nungambakkam. Award-winning restaurants and a legendary bar.",
    price: 7000,
    location: "Nungambakkam, Chennai",
    image: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80"],
  },
];

const PACKAGES = [
  {
    title: "Heritage Explorer",
    duration: "3 Days / 2 Nights",
    price: "₹14,999",
    badge: "Bestseller",
    category: "Heritage",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Shore_Temple_2.jpg/1200px-Shore_Temple_2.jpg",
    highlights: ["Shore Temple", "Kapaleeshwarar Temple", "Fort St. George", "Government Museum"],
  },
  {
    title: "Beach & Culture Trail",
    duration: "2 Days / 1 Night",
    price: "₹8,499",
    badge: "Popular",
    category: "Beach",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Marina_Beach_in_Chennai.jpg/1200px-Marina_Beach_in_Chennai.jpg",
    highlights: ["Marina Beach", "Elliot's Beach", "Mylapore Walk", "Local Cuisine Tour"],
  },
  {
    title: "Temple Circuit",
    duration: "4 Days / 3 Nights",
    price: "₹18,299",
    badge: "New",
    category: "Spiritual",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kapaleeshwarar_Temple.jpg/1200px-Kapaleeshwarar_Temple.jpg",
    highlights: ["Kapaleeshwarar Temple", "Parthasarathy Temple", "Mahabalipuram", "Kanchipuram"],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  const destCount = await Destination.countDocuments();
  if (destCount === 0) {
    await Destination.insertMany(DESTINATIONS);
    console.log(`✅ Inserted ${DESTINATIONS.length} destinations`);
  } else {
    console.log(`⏭  Destinations already exist (${destCount} found) — skipped`);
  }

  const hotelCount = await HotelListing.countDocuments();
  if (hotelCount === 0) {
    await HotelListing.insertMany(HOTELS);
    console.log(`✅ Inserted ${HOTELS.length} hotels`);
  } else {
    console.log(`⏭  Hotels already exist (${hotelCount} found) — skipped`);
  }

  const pkgCount = await Package.countDocuments();
  if (pkgCount === 0) {
    await Package.insertMany(PACKAGES);
    console.log(`✅ Inserted ${PACKAGES.length} packages`);
  } else {
    console.log(`⏭  Packages already exist (${pkgCount} found) — skipped`);
  }

  console.log("\n🎉 Seed complete! Open http://localhost:5173 to see the data.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error("Seed failed:", err); process.exit(1); });
