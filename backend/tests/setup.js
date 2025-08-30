import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { jest } from '@jest/globals';

// Load environment variables
dotenv.config({ path: '.env.test' });

// Setup test database connection
beforeAll(async () => {
  try {
    // Try to connect to local MongoDB first
    await mongoose.connect('mongodb://localhost:27017/pix_test', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to local MongoDB for testing');
  } catch (error) {
    console.log('⚠️  No MongoDB available, tests will run without database');
    // Don't mock mongoose, just let tests handle the disconnected state
  }
});

// Clean up after each test
afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  }
});

// Close database connection after all tests
afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
});

// Global test timeout
jest.setTimeout(30000);
