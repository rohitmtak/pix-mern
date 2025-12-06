/**
 * Change Admin Password Script
 * 
 * Changes the password for an existing admin user.
 * 
 * Usage:
 *   ADMIN_EMAIL=admin@highstreetpix.com NEW_PASSWORD=NewSecurePassword node scripts/changeAdminPassword.js
 * 
 * SECURITY: Environment variables are REQUIRED.
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import Admin from "../models/adminModel.js";

// Load environment-specific .env file
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

const run = async () => {
  try {
    // Require environment variables
    const email = process.env.ADMIN_EMAIL;
    const newPassword = process.env.NEW_PASSWORD;
    
    if (!email || !newPassword) {
      console.error("❌ ERROR: ADMIN_EMAIL and NEW_PASSWORD environment variables are required!");
      console.error("   Usage: ADMIN_EMAIL=admin@email.com NEW_PASSWORD=NewPassword node scripts/changeAdminPassword.js");
      process.exit(1);
    }

    if (newPassword.length < 8) {
      console.error("❌ ERROR: Password must be at least 8 characters long!");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_URL);
    console.log("✅ DB Connected");

    // Find admin
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      console.error(`❌ ERROR: Admin with email ${email} not found!`);
      mongoose.connection.close();
      process.exit(1);
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);
    
    // Update password and clear active session (force re-login)
    admin.password = hashed;
    admin.activeSessionId = null;
    await admin.save();

    console.log(`✅ Password changed successfully for ${admin.email}`);
    console.log("⚠️  All active sessions have been invalidated. Admin must login again.");
    
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

run();

