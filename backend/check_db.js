require("dotenv").config();
const mongoose = require("mongoose");

async function inspect() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  
  const collections = await db.listCollections().toArray();
  console.log("\n=== COLLECTIONS IN DATABASE ===");
  collections.forEach(c => console.log(" •", c.name));

  for (const col of collections) {
    const docs = await db.collection(col.name).find({}).limit(2).toArray();
    if (docs.length > 0) {
      console.log(`\n=== ${col.name.toUpperCase()} — first document fields ===`);
      console.log(JSON.stringify(docs[0], null, 2));
    } else {
      console.log(`\n=== ${col.name.toUpperCase()} — EMPTY ===`);
    }
  }

  await mongoose.disconnect();
}

inspect().catch(e => { console.error(e); process.exit(1); });
