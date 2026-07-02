const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Service = require('../models/Service');
const Gallery = require('../models/Gallery');
const Technology = require('../models/Technology');
const ProcessStep = require('../models/ProcessStep');
const { submitContact } = require('../controllers/contactController');

router.get('/products', async (req, res) => res.json(await Product.findAll()));
router.get('/services', async (req, res) => res.json(await Service.findAll()));
router.get('/gallery', async (req, res) => res.json(await Gallery.findAll()));
router.get('/technologies', async (req, res) => res.json(await Technology.findAll())); // NEW
router.get('/process-steps', async (req, res) => res.json(await ProcessStep.findAll({ order: [['stepNumber', 'ASC']] }))); // NEW
router.post('/contact', submitContact);

module.exports = router;