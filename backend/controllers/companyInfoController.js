const CompanyInfo = require('../models/CompanyInfo');

// Get Company Info
exports.getCompanyInfo = async (req, res) => {
  try {
    const info = await CompanyInfo.findOne();
    res.json(info || {});
    } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Company Info
exports.updateCompanyInfo = async (req, res) => {
  try {
    const info = await CompanyInfo.findOne();
    if (info) {
      await info.update(req.body);
    } else {
      await CompanyInfo.create(req.body);
    }
    res.json({ message: 'Company information updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};