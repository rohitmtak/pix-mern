import bcrypt from 'bcryptjs';
import 'dotenv/config';

// Script to generate admin password hash
const generateAdminHash = async () => {
  const password = process.argv[2];
  
  if (!password) {
    console.error('Please provide a password as an argument');
    console.log('Usage: node generateAdminHash.js <password>');
    process.exit(1);
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    console.log('Admin Password Hash Generated:');
    console.log('================================');
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
    console.log('================================');
    console.log('Add this to your .env file:');
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log('================================');
    console.log('IMPORTANT: Remove ADMIN_PASSWORD from your .env file!');
    
  } catch (error) {
    console.error('Error generating hash:', error);
    process.exit(1);
  }
};

generateAdminHash();
