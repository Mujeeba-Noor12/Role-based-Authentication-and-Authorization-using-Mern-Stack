const express = require('express');
const { register, login ,profile, admin ,logout} = require('../controllers/userController.js');
const checkRoles = require('../middleware/checkRoles.js');

const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register); 
router.post('/login', login);  
router.get('/profile',profile);  
router.get('/logout',logout);  

router.get('/admin',authenticate, checkRoles('admin'),admin); 


module.exports = router;
