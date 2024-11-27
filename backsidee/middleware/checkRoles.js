
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const checkRoles = (requiredRole) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); 

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' }); 
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; 

      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' }); // Role mismatch
      }

      next(); 
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' }); 
    }
  };
};

module.exports = checkRoles;
