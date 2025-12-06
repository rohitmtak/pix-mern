/**
 * Admin Creation Script
 * 
 * Creates an admin user in the database.
 * 
 * Usage:
 *   ADMIN_CREATE_EMAIL=your@email.com ADMIN_CREATE_PASSWORD=YourPassword node scripts/createAdmin.js
 * 
 * SECURITY: Environment variables are REQUIRED. No default credentials for security.
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
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_URL);
    console.log("DB Connected");

    // Require environment variables for security - no defaults!
    const email = process.env.ADMIN_CREATE_EMAIL;
    const password = process.env.ADMIN_CREATE_PASSWORD;
    
    if (!email || !password) {
      console.error("❌ ERROR: ADMIN_CREATE_EMAIL and ADMIN_CREATE_PASSWORD environment variables are required!");
      console.error("   Usage: ADMIN_CREATE_EMAIL=your@email.com ADMIN_CREATE_PASSWORD=YourPassword node scripts/createAdmin.js");
      process.exit(1);
    }
    
    const hashed = await bcrypt.hash(password, 10);

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log("Admin already exists:", existing.email);
      return process.exit(0);
    }

    const admin = await Admin.create({
      email: email.toLowerCase(),
      password: hashed,
      role: "admin"
    });

    console.log("Admin created successfully:", admin.email);
    mongoose.connection.close();
  } catch (err) {
    console.error("Error:", err);
    mongoose.connection.close();
  }
};

run();
