import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Admin from "../models/adminModel.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_URL);
    console.log("DB Connected");

    const email = "admin@highstreetpix.com";
    const password = "Admin@12345";
    const hashed = await bcrypt.hash(password, 10);

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("Admin already exists:", existing.email);
      return process.exit(0);
    }

    const admin = await Admin.create({
      email,
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
