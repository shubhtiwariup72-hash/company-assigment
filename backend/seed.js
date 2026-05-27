/**
 * Seed script — run once to load the existing db.json data into MongoDB.
 * Usage: node seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");
const MonthlyStats = require("./models/MonthlyStats");
const data = require("./data/db.json");

const seed = async () => {
  await connectDB();

  console.log("Clearing existing collections...");
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    MonthlyStats.deleteMany({}),
  ]);

  console.log("Seeding users...");
  await User.insertMany(data.users);

  console.log("Seeding products...");
  await Product.insertMany(data.products);

  console.log("Seeding monthly stats...");
  await MonthlyStats.insertMany(data.monthlyStats);

  const userCount = await User.countDocuments();
  const productCount = await Product.countDocuments();
  const statsCount = await MonthlyStats.countDocuments();

  console.log(`✅ Seeding complete:`);
  console.log(`   Users:         ${userCount}`);
  console.log(`   Products:      ${productCount}`);
  console.log(`   Monthly stats: ${statsCount}`);

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
