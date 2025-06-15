// src/config/db.js
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction
const dotenv = require('dotenv');
dotenv.config();

// Define the MongoDB connection function
const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URI);
    
    // Attempt to connect to the MongoDB database
    // Replace 'mongodb://localhost:27017/your_database_name' with your actual MongoDB URI
    // For example, if you're using MongoDB Atlas, it would look like:
    // 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority'
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://akilo:TpC3jnr8dNO4Zy5p@akilo.xeyi9wn.mongodb.net/?retryWrites=true&w=majority&appName=akilo', {
      // These options are recommended to avoid deprecation warnings
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`); // Log successful connection
  } catch (error) {
    console.error(`Error: ${error.message}`); // Log any connection errors
    process.exit(1); // Exit the process with a failure code
  }
};

module.exports = connectDB; // Export the connection function