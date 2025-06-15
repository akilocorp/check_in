const express=require('express');
const multer=require('multer')
const app= express();

//Middleware
const middleware=express.json()
const authHandlers = require('./routes/auth');
const scanHandlers = require('./routes/scan');
const verifyToken=require('./middlewares/verify_token')

app.use(middleware)


app.use((req, res,next)=>{
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next()
    
})

// --- Configure Multer for file uploads ---
// Set storage engine to memory storage to handle file in buffer
const upload = multer({
  storage: multer.memoryStorage(), // Store the file in memory as a Buffer
  fileFilter: (req, file, cb) => {
    // Only accept Excel file types
    if (file.mimetype.includes('excel') || file.mimetype.includes('spreadsheetml')) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed!'), false);
    }
  }
});

app.post('/api/upload-users', upload.single('user_credentials_output'), authHandlers.uploadUsers)
app.post('/api/login', authHandlers.login)
app.post('/api/scan', verifyToken, scanHandlers.scanUsers )
app.post('/api/register',authHandlers.register )




app.use((err,req,res,next)=>{
    console.log(err.stack);
    res.status(500).send('something broke')
    
})


module.exports= app;