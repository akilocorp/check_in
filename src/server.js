const app=require('./main.js')
const connectDB = require('./config/db'); // Import the database connection function
const dotenv = require('dotenv');
dotenv.config();

const PORT= process.env.PORT ||3000;

connectDB();

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
    
    
})

