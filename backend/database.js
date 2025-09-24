const mongoose = require('mongoose');

// Mongoose connection string (read from env or fallback)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://usha_db:q6B3GxlQeGLGhnOB@cluster0.3kjtlxz.mongodb.net/resume_app?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = process.env.DB_NAME || 'resume_app';

// Connect to MongoDB with Mongoose
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  console.log('✅ Mongoose connected (database.js)');
  return mongoose;
};

// Get a native collection via Mongoose connection (shim for existing code)
const getCollection = async (collectionName = 'resumes') => {
  await connectToDatabase();
  return mongoose.connection.db.collection(collectionName);
};

// Close mongoose connection
const closeConnection = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('🔌 Mongoose connection closed');
  }
};

// Test database connection (simple ping using admin command)
const testConnection = async () => {
  try {
    await connectToDatabase();
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('✅ Database connection test successful (ping)');
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
};

module.exports = {
  connectToDatabase,
  getCollection,
  closeConnection,
  testConnection,
};
