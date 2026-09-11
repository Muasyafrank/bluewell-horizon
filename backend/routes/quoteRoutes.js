const express = require('express');
const router = express.Router();
const { submitQuote } = require('../controllers/quoteController');

router.post('/', submitQuote);

module.exports = router;