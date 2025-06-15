const mongoose = require('mongoose'); // Import Mongoose
const bcrypt = require('bcryptjs'); 

// Define the User Schema
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,      // Username is required
      unique: true,        // Username must be unique
      trim: true,          // Trim whitespace from username
    },
    password: {
      type: String,
      required: true,      // Password is required
    },
    email:{
        type:String,
        required:false
    },
    full_name:{
        type: String,
        required:false
    },
    ticket_type:{
        type: String,
        required:false  
    },
    no_people:{
        type: Number,
        required:false  
    },
    qr_code_url: {
      type: String,
      unique: true,        // QR code should be unique
      sparse: true, 
      // You might add a default or generate this on registration in a service
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user',
        required:true
    },
    is_active:{
        type:Boolean,
        required:true
    }

  },
  {
    timestamps: true,      // Add createdAt and updatedAt timestamps automatically
  }
);

// --- Pre-save hook to hash password before saving ---
userSchema.pre('save', async function (next) {
  // Check if the password field has been modified or if it's a new user
  if (!this.isModified('password')) {
    next(); // If not modified, move to the next middleware
  }

  // Generate a salt with 10 rounds (cost factor)
  const salt = await bcrypt.genSalt(10);
  // Hash the password using the generated salt
  this.password = await bcrypt.hash(this.password, salt);
  next(); // Move to the next middleware (saving the user)
});

// --- Method to compare entered password with hashed password ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Use bcrypt.compare to compare the plain text password with the hashed password
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User Model
const User = mongoose.model('User', userSchema);
module.exports = User;