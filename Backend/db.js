const mongoose = require("mongoose");
const dbUrl = process.env.ATLAS_DB_URL;

const connectDB = async () => {
  console.log("Inside Connect DB");
  console.log(mongoose.connection.readyState);

  // Check if not already connected
  console.log("Inside Connection");
  try {
    await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
