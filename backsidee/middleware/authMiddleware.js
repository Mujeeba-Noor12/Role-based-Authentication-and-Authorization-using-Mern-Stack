const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); 
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied! No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    
    req.user = decoded; 
    console.log('Authenticated user:', req.user); 

    next(); 
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token!' }); 
  }
};

module.exports = authenticate;
