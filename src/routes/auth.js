const app= require('../main')
const xlsx = require('xlsx'); 
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const uploadUsers= async(req,res)=>{
    if(!req.file){
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    try{
        //read excel file

        const workbook=xlsx.read(req.file.buffer, {type:'buffer'})
        const sheetName=workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName];
        const usersData=xlsx.utils.sheet_to_json(worksheet)

        let usersRegistered=0;
        let errors=[];
        
        for(const userData of usersData){
            const{email,username, password,full_name,ticket_type, no_people, qr_code_url, role, is_active }=userData;
            if (!username|| !password){
                errors.push({ user: username, message: 'Username and password are required.' });
                continue; 
            }
            try{
                const userExists=await User.findOne({username});
                if(userExists){
                     errors.push({user:username, message:'User already exists'})
                     continue;
                }
                if(qr_code_url){
                    const qrcodeExists=await User.findOne({qr_code_url});
                    if(qrcodeExists){
                        errors.push({user:username,message:'QR Code already exists'})
                        continue;
                    }
                }

                const user=await User.create({
                    username:username, 
                    password:password, 
                    qr_code_url:qr_code_url, 
                    role:role, 
                    email:email, 
                    full_name:full_name, 
                    ticket_type: ticket_type, 
                    no_people:no_people, 
                    is_active:true
                });

                    usersRegistered++;
                    console.log(`User ${username} registered successfully.`);

                    
            }catch(dbError){
                console.error(`Database error for user ${username}:`, dbError);
                errors.push({ user: username, message: `Database error: ${dbError.message}` });
            }

        }
         if (errors.length > 0) {
            return res.status(207).json({ // 207 Multi-Status if some succeeded and some failed
            message: `Processed ${usersData.length} users. ${usersRegistered} registered successfully, ${errors.length} with errors.`,
            details: errors,
      });
    } else {
            res.status(200).json({ message: `Successfully registered ${usersRegistered} users from the Excel file.` });
    }


    }
    catch (error) {
    console.error('File upload/processing error:', error);
    res.status(500).json({ message: `Server error processing file: ${error.message}` });
  }
}




const register = async (req, res) => {
  const { email,username, password,full_name,ticket_type, no_people, role, is_active} = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    

    if (role=='admin'){
        const user = await User.create({
        username,
        password,
        role: role,
        email:email|| '',
        ticket_type:'',
        is_active:true

    });

    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: user._id,
        username: user.username,
        password: user.password,
        role: user.role,
      // Include new field in response
      },
      token: generateToken(user._id.toString()),
    });
    }

    else{
    const user = await User.create({
                    username:username, 
                    password:password, 
                    qr_code_url:qr_code_url, 
                    role:role, 
                    email:email, 
                    full_name:full_name, 
                    ticket_type: ticket_type, 
                    no_people:no_people, 
                    is_active:true

    });

    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: user._id,
        username: user.username,
        password: user.password,
        role: user.role, // Include new field in response
      },
      token: generateToken(user._id.toString()),
    });}
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};


// --- Login Route to use MongoDB and Hashing ---
const login=async (req, res) => {
  const { username, password } = req.body; // Destructure username and password

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Find the user by username in the database
    const user = await User.findOne({ username });
    console.log(user._id);
    
    // Check if user exists and if the password matches
    if (user && (await user.matchPassword(password))) {
      // If credentials are valid, send a success response
      res.json({
        message: 'Login successful!',
        user: {
          id: user._id,
          username: user.username,
          ticket_type: user.ticket_type,
          email:user.email,
          role: user.role,
          no_people: user.no_people,
          is_active:user.is_active,
        },
        token: generateToken(user._id.toString()),
    
      });
    } else {
      // If user not found or password doesn't match, send unauthorized status
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
}

module.exports = {
  register,
  login,
  uploadUsers,

};