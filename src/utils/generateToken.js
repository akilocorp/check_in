// src/utils/generateToken.js
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

const dotenv = require('dotenv');
dotenv.config();


// Function to generate a JWT
const generateToken = (id) => {
    console.log(process.env.MONGO_URI);

  // Sign the token with the user's ID, a secret key, and an expiration time
  // The secret key should be stored securely, e.g., in an environment variable
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
  });
};

module.exports = generateToken; // Export the function
