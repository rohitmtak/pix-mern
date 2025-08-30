import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const cleanupDuplicateAddresses = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Get all users
    const users = await userModel.find({});
    console.log(`Found ${users.length} users`);

    let totalDuplicatesRemoved = 0;

    for (const user of users) {
      if (!user.addresses || user.addresses.length === 0) continue;

      const originalCount = user.addresses.length;
      const uniqueAddresses = [];
      const seenAddresses = new Set();

      for (const address of user.addresses) {
        // Create a unique key for each address based on its content
        const addressKey = `${address.fullName}|${address.phone}|${address.line1}|${address.line2}|${address.city}|${address.state}|${address.postalCode}|${address.country}`;
        
        if (!seenAddresses.has(addressKey)) {
          seenAddresses.add(addressKey);
          uniqueAddresses.push(address);
        } else {
          console.log(`Removing duplicate address for user ${user.email}: ${address.fullName} - ${address.line1}`);
          totalDuplicatesRemoved++;
        }
      }

      // Update user with deduplicated addresses
      if (uniqueAddresses.length !== originalCount) {
        await userModel.updateOne(
          { _id: user._id },
          { $set: { addresses: uniqueAddresses } }
        );
        console.log(`User ${user.email}: Removed ${originalCount - uniqueAddresses.length} duplicate addresses`);
      }
    }

    console.log(`\nCleanup complete! Total duplicates removed: ${totalDuplicatesRemoved}`);
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the cleanup
cleanupDuplicateAddresses();
