const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.warn('⚠️ MONGO_URI is not defined in the environment variables.');
    console.warn('⚠️ MongoDB operations (Doc uploads, persistent history) will be bypassed / fail-safed.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ MongoDB operations (Doc uploads, persistent history) will be bypassed / fail-safed.');
    return false;
  }
};

module.exports = connectDB;
