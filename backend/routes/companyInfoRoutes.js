const express = require('express');
const router = express.Router();
const { getCompanyInfo, updateCompanyInfo } = require('../controllers/companyInfoController');
const { protect } = require('../middleware/auth');

router.get('/', getCompanyInfo);
router.put('/', protect, updateCompanyInfo);

module.exports = router;