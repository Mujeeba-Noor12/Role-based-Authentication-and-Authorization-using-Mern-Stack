
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const dotenv = require('dotenv');


dotenv.config();

const register = async (req, res) => {
  const { fullname, username, password, email,confirmPassword,role,gender } = req.body;



  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  const existingUser = await userModel.findOne({ 
    $or: [{ email }, { username }] 
  });
  if (existingUser) {
  console.error('User already exists with this email or username'); // Log for debugging
   return res.status(400).json({ message: 'User already exists with this email or username'}); // Generic response
}

 

  try {
   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

 
    const user = await userModel.create({
      fullname,
      username,
      email,
      password: hashedPassword,
      confirmPassword,
      role,
      
    });
  console.log(process.env.JWT_SECRET)
    const token = jwt.sign({id: user._id, email: user.email , role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

   
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Error during registration', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
   
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found!' });

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials!' });

  
    const token = jwt.sign({id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

  
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};

  


  
  
  
  const admin = async (req, res) => {
    console.log('Admin user:', req.user);
    try {
      const users = await userModel.find(); 
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  };
  const profile = async (req, res) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid Authorization header:', authHeader);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const token = authHeader.split(' ')[1];
    
    try {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); 
  
      
      const user = await userModel.findById(decoded.id);
      console.log('User fetched:', user);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ 
        id: user._id, 
        email: user.email, 
        name: user.fullname,
        role: user.role 
      });
    } catch (error) {
      console.error('Token verification error:', error.message);
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
  
 
  
  

  
  
  const logout = async (req, res) => {
    try {
      res.clearCookie('token'); 
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Logout failed" });
    }
  };
  

module.exports = { register, login,profile,logout,admin };

