const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Gallery = require('../models/Gallery');

// Generic CRUD factory
const createCrudRoutes = (routePath, Model) => {
  router.post(routePath, protect, async (req, res) => {
    try { res.status(201).json(await Model.create(req.body)); } 
    catch (e) { res.status(500).json({ message: e.message }); }
  });
  router.put(`${routePath}/:id`, protect, async (req, res) => {
    try { const item = await Model.findByPk(req.params.id); await item.update(req.body); res.json(item); } 
    catch (e) { res.status(500).json({ message: e.message }); }
  });
  router.delete(`${routePath}/:id`, protect, async (req, res) => {
    try { await Model.destroy({ where: { id: req.params.id } }); res.json({ message: 'Deleted' }); } 
    catch (e) { res.status(500).json({ message: e.message }); }
  });
};

createCrudRoutes('/products', Product);
createCrudRoutes('/services', Service);
createCrudRoutes('/gallery', Gallery);

module.exports = router;