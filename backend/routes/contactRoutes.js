const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/contactController');

// Define the POST route
router.post('/', submitContactForm);

// THIS LINE IS CRUCIAL - It must be module.exports (with an 's')
module.exports = router; 