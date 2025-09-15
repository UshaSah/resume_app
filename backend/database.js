const { MongoClient } = require('mongodb');

// MongoDB connection string (replace <db_password> with your actual password)
const MONGODB_URI = 'mongodb+srv://usha_db:q6B3GxlQeGLGhnOB@cluster0.3kjtlxz.mongodb.net/resume_app?retryWrites=true&w=majority&appName=Cluster0';

// Database and collection names
const DB_NAME = 'resume_app';
const COLLECTION_NAME = 'resumes';

let client;
let db;
let collection;

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      console.log('✅ Connected to MongoDB Atlas');
    }
    
    if (!db) {
      db = client.db(DB_NAME);
    }
    
    if (!collection) {
      collection = db.collection(COLLECTION_NAME);
    }
    
    return { client, db, collection };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

// Get collection instance
const getCollection = async () => {
  const { collection } = await connectToDatabase();
  return collection;
};

// Close database connection
const closeConnection = async () => {
  if (client) {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
};

// Test database connection
const testConnection = async () => {
  try {
    const collection = await getCollection();
    
    // Test by inserting a simple document
    const testDoc = {
      test: true,
      message: 'Database connection test',
      timestamp: new Date()
    };
    
    const result = await collection.insertOne(testDoc);
    console.log('✅ Database connection test successful:', result.insertedId);
    
    // Clean up test document
    await collection.deleteOne({ _id: result.insertedId });
    console.log('🧹 Test document cleaned up');
    
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
  testConnection
};
