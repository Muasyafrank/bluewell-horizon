const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');

// 1. Register Customer
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await Customer.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await Customer.create({ name, email, password: hashedPassword, phone });

    const token = jwt.sign({ id: customer.id, email: customer.email }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ message: 'Registration successful', token, customer: { id: customer.id, name: customer.name, email: customer.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 2. Login Customer
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ where: { email } });
    if (!customer) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: customer.id, email: customer.email }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ message: 'Login successful', token, customer: { id: customer.id, name: customer.name, email: customer.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 3. Get Customer Profile
exports.getProfile = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.customer.id, { attributes: { exclude: ['password'] } });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 4. Get Order History
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { customerId: req.customer.id },
      order: [['createdAt', 'DESC']],
      include: [{
        model: OrderItem,
        include: [{ model: Product, attributes: ['name', 'image', 'category'] }]
      }]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};