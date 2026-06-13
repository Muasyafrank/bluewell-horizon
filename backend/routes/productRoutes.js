const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Create order
router.post('/checkout', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, city, items, paymentMethod, notes } = req.body;

    // Calculate total
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        totalAmount += product.price * item.quantity;
      }
    }

    // Generate order number
    const orderNumber = 'BWH-' + Date.now();

    // Create order
    const order = await Order.create({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      totalAmount,
      paymentMethod,
      notes,
      paymentStatus: 'pending',
      orderStatus: 'processing'
    });

    // Create order items
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Send email notification (similar to contact form)
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Order: ${orderNumber}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${customerPhone}</p>
        <p><strong>Address:</strong> ${shippingAddress}, ${city}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Total Amount:</strong> KES ${totalAmount.toFixed(2)}</p>
        <h3>Items:</h3>
        <ul>
          ${items.map(item => `<li>${item.name} x ${item.quantity} - KES ${item.price.toFixed(2)}</li>`).join('')}
        </ul>
      `
    });

    // Email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <h2>Thank you for your order!</h2>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p>We have received your order and will process it shortly.</p>
        <p><strong>Total Amount:</strong> KES ${totalAmount.toFixed(2)}</p>
        <p>Our team will contact you within 24 hours to confirm your order and arrange delivery.</p>
        <p>For inquiries, contact us at 0721-633-223 or bluewellsynergy@gmail.com</p>
        <p>Best regards,<br/>Bluewell Horizon Team</p>
      `
    });

    res.status(201).json({ 
      message: 'Order placed successfully', 
      orderNumber,
      orderId: order.id 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

module.exports = router;