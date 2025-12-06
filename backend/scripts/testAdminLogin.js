import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const envFile = isProduction ? '.env.production' : '.env';
const envPath = path.join(__dirname, '..', envFile);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`📝 Loaded ${envFile}`);
} else {
  dotenv.config();
}

// Test configuration
const TEST_EMAIL = "test-admin@highstreetpix.com";
const TEST_PASSWORD = "Test@12345";

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Test results tracker
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function recordTest(name, passed, message = '') {
  testResults.tests.push({ name, passed, message });
  if (passed) {
    testResults.passed++;
    logSuccess(`${name}: ${message || 'PASSED'}`);
  } else {
    testResults.failed++;
    logError(`${name}: ${message || 'FAILED'}`);
  }
}

async function testDatabaseConnection() {
  log('\n📊 Testing Database Connection...', 'blue');
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;
    if (!mongoUri) {
      recordTest('Database Connection', false, 'MONGODB_URI not found in environment');
      return false;
    }
    
    await mongoose.connect(mongoUri);
    logInfo('Connected to MongoDB');
    recordTest('Database Connection', true, 'Successfully connected');
    return true;
  } catch (error) {
    recordTest('Database Connection', false, error.message);
    return false;
  }
}

async function testAdminModel() {
  log('\n📦 Testing Admin Model...', 'blue');
  try {
    // Check if Admin model exists
    const adminCount = await Admin.countDocuments();
    logInfo(`Found ${adminCount} admin(s) in database`);
    recordTest('Admin Model', true, `Model exists with ${adminCount} admin(s)`);
    return true;
  } catch (error) {
    recordTest('Admin Model', false, error.message);
    return false;
  }
}

async function testCreateAdmin() {
  log('\n👤 Testing Admin Creation...', 'blue');
  try {
    // Check if test admin already exists
    const existing = await Admin.findOne({ email: TEST_EMAIL.toLowerCase() });
    if (existing) {
      logWarning('Test admin already exists, deleting...');
      await Admin.deleteOne({ email: TEST_EMAIL.toLowerCase() });
    }

    // Create test admin
    const hashed = await bcrypt.hash(TEST_PASSWORD, 10);
    const admin = await Admin.create({
      email: TEST_EMAIL.toLowerCase(),
      password: hashed,
      role: "admin"
    });

    if (admin && admin._id) {
      recordTest('Admin Creation', true, `Admin created with ID: ${admin._id}`);
      return admin;
    } else {
      recordTest('Admin Creation', false, 'Admin creation returned invalid result');
      return null;
    }
  } catch (error) {
    recordTest('Admin Creation', false, error.message);
    return null;
  }
}

async function testAdminLogin() {
  log('\n🔐 Testing Admin Login Logic...', 'blue');
  try {
    const admin = await Admin.findOne({ email: TEST_EMAIL.toLowerCase() });
    
    if (!admin) {
      recordTest('Admin Login - Find Admin', false, 'Admin not found in database');
      return false;
    }
    recordTest('Admin Login - Find Admin', true, 'Admin found in database');

    // Test password comparison
    const isMatch = await bcrypt.compare(TEST_PASSWORD, admin.password);
    if (!isMatch) {
      recordTest('Admin Login - Password Match', false, 'Password comparison failed');
      return false;
    }
    recordTest('Admin Login - Password Match', true, 'Password matches');

    // Test token generation
    const token = jwt.sign(
      { 
        id: admin._id,
        email: admin.email, 
        role: admin.role || 'admin' 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    if (!token) {
      recordTest('Admin Login - Token Generation', false, 'Token generation failed');
      return false;
    }
    recordTest('Admin Login - Token Generation', true, 'Token generated successfully');

    // Test token verification
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.id && decoded.email && decoded.role) {
        recordTest('Admin Login - Token Verification', true, 'Token verified successfully');
        return { admin, token, decoded };
      } else {
        recordTest('Admin Login - Token Verification', false, 'Token missing required fields');
        return false;
      }
    } catch (verifyError) {
      recordTest('Admin Login - Token Verification', false, verifyError.message);
      return false;
    }
  } catch (error) {
    recordTest('Admin Login', false, error.message);
    return false;
  }
}

async function testAdminAuthMiddleware() {
  log('\n🛡️  Testing Admin Auth Middleware Logic...', 'blue');
  try {
    const admin = await Admin.findOne({ email: TEST_EMAIL.toLowerCase() });
    
    if (!admin) {
      recordTest('Admin Auth - Find Admin', false, 'Admin not found');
      return false;
    }

    // Generate token
    const token = jwt.sign(
      { 
        id: admin._id,
        email: admin.email, 
        role: admin.role || 'admin' 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Update active session
    admin.activeSessionId = token;
    await admin.save();

    // Verify token
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check role
    if (token_decode.role !== 'admin' && token_decode.role !== 'superadmin') {
      recordTest('Admin Auth - Role Check', false, 'Invalid role in token');
      return false;
    }
    recordTest('Admin Auth - Role Check', true, 'Role is valid');

    // Check admin exists
    const foundAdmin = await Admin.findById(token_decode.id);
    if (!foundAdmin) {
      recordTest('Admin Auth - Admin Exists', false, 'Admin not found by ID');
      return false;
    }
    recordTest('Admin Auth - Admin Exists', true, 'Admin found by ID');

    // Check session match
    if (foundAdmin.activeSessionId !== token) {
      recordTest('Admin Auth - Session Match', false, 'Session token mismatch');
      return false;
    }
    recordTest('Admin Auth - Session Match', true, 'Session token matches');

    return true;
  } catch (error) {
    recordTest('Admin Auth Middleware', false, error.message);
    return false;
  }
}

async function testTokenRefresh() {
  log('\n🔄 Testing Token Refresh Logic...', 'blue');
  try {
    const admin = await Admin.findOne({ email: TEST_EMAIL.toLowerCase() });
    
    if (!admin) {
      recordTest('Token Refresh - Find Admin', false, 'Admin not found');
      return false;
    }

    // Create initial token
    const oldToken = jwt.sign(
      { 
        id: admin._id,
        email: admin.email, 
        role: admin.role || 'admin' 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    admin.activeSessionId = oldToken;
    await admin.save();

    // Verify old token
    const oldDecoded = jwt.verify(oldToken, process.env.JWT_SECRET);
    
    // Generate new token
    const newToken = jwt.sign(
      { 
        id: admin._id,
        email: admin.email, 
        role: admin.role || 'admin' 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Update session
    admin.activeSessionId = newToken;
    await admin.save();

    // Verify new token
    const newDecoded = jwt.verify(newToken, process.env.JWT_SECRET);
    
    if (newDecoded.id === oldDecoded.id && newDecoded.email === oldDecoded.email) {
      recordTest('Token Refresh', true, 'Token refreshed successfully');
      return true;
    } else {
      recordTest('Token Refresh', false, 'Token refresh failed - mismatched data');
      return false;
    }
  } catch (error) {
    recordTest('Token Refresh', false, error.message);
    return false;
  }
}

async function cleanup() {
  log('\n🧹 Cleaning up test data...', 'blue');
  try {
    await Admin.deleteOne({ email: TEST_EMAIL.toLowerCase() });
    logInfo('Test admin deleted');
    recordTest('Cleanup', true, 'Test data cleaned up');
  } catch (error) {
    logWarning(`Cleanup error: ${error.message}`);
    recordTest('Cleanup', false, error.message);
  }
}

async function runAllTests() {
  log('\n🚀 Starting Admin Login Setup Tests...', 'blue');
  log('==========================================\n', 'blue');

  // Check environment
  if (!process.env.JWT_SECRET) {
    logError('JWT_SECRET not found in environment variables');
    logInfo('Please ensure JWT_SECRET is set in your .env file');
    process.exit(1);
  }

  if (!process.env.MONGODB_URI && !process.env.MONGODB_URL) {
    logError('MONGODB_URI or MONGODB_URL not found in environment variables');
    logInfo('Please ensure MongoDB connection string is set in your .env file');
    process.exit(1);
  }

  try {
    // Run tests
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      logError('Cannot proceed without database connection');
      process.exit(1);
    }

    await testAdminModel();
    await testCreateAdmin();
    await testAdminLogin();
    await testAdminAuthMiddleware();
    await testTokenRefresh();
    
    // Cleanup
    await cleanup();

    // Print summary
    log('\n📊 Test Summary', 'blue');
    log('================\n', 'blue');
    
    testResults.tests.forEach(test => {
      if (test.passed) {
        logSuccess(`${test.name}: ${test.message || 'PASSED'}`);
      } else {
        logError(`${test.name}: ${test.message || 'FAILED'}`);
      }
    });

    log(`\n✅ Passed: ${testResults.passed}`, 'green');
    log(`❌ Failed: ${testResults.failed}`, 'red');
    log(`📈 Total: ${testResults.passed + testResults.failed}\n`, 'cyan');

    if (testResults.failed === 0) {
      log('🎉 All tests passed! Admin login setup is working correctly.', 'green');
      log('\n💡 Next steps:', 'cyan');
      log('   1. Run: node backend/scripts/createAdmin.js (to create your production admin)', 'cyan');
      log('   2. Test login through your admin panel', 'cyan');
      log('   3. Remove ADMIN_EMAIL and ADMIN_PASSWORD_HASH from .env (optional)', 'cyan');
    } else {
      log('⚠️  Some tests failed. Please review the errors above.', 'yellow');
    }

  } catch (error) {
    logError(`Unexpected error: ${error.message}`);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    logInfo('Database connection closed');
    process.exit(testResults.failed === 0 ? 0 : 1);
  }
}

// Run tests
runAllTests();

