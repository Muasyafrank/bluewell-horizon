const express = require('express');
const router = express.Router();
const { register, login, getProfile, getOrders } = require('../controllers/customerController');
const { protect } = require('../middleware/auth'); // Reuse the same auth middleware

// Helper to verify customer token
const customerProtect = (req, res, next) => {
  let token = req.headers.authorization;
  if (token && token.startsWith('Bearer ')) {
    try {
      token = token.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.customer = decoded; // Attach customer info to request
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
// Note: You need to require 'jsonwebtoken' at the top of this file for customerProtect to work.
const jwt = require('jsonwebtoken');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', customerProtect, getProfile);
router.get('/orders', customerProtect, getOrders);

module.exports = router;