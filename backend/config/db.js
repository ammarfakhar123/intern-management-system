const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  // If already connected, reuse existing Mongoose connection
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/intern_management';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    // On Vercel / serverless environment, in-memory binary downloads are not supported
    if (process.env.VERCEL) {
      console.error('❌ MongoDB Connection Error on Vercel:', err.message);
      console.warn('⚠️ Please add the MONGODB_URI environment variable in your Vercel Project Settings (e.g., from MongoDB Atlas).');
      throw err;
    }

    console.warn(`⚠️ Could not connect to MongoDB at ${uri}.`);
    console.log('🔄 Initializing fallback In-Memory MongoDB Server for zero-friction local execution...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'intern_management',
        },
      });
      const memoryUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`✅ Connected to In-Memory MongoDB at: ${memoryUri}`);
      return conn;
    } catch (memErr) {
      console.error('❌ Failed to start In-Memory MongoDB:', memErr.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };
