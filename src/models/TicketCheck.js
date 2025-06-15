const mongoose = require('mongoose'); // Import Mongoose
const bcrypt = require('bcryptjs'); 

// Define the User Schema
const ticketCheckSchema = mongoose.Schema(
  {
   no_of_scans:{
    type:Number,
    required:true,
   },
   ticket_id:{
    type:String,
    required:true
   }
  },
  {
    timestamps: true,      // Add createdAt and updatedAt timestamps automatically
  }
);



// Create and export the User Model
const TicketCheck = mongoose.model('TicketCheck', ticketCheckSchema );
module.exports = TicketCheck;