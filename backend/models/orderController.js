const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');

exports.checkout = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, city, items, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // 1. Calculate total and verify prices
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // 2. Generate Order Number
    const orderNumber = 'BWH-' + Date.now().toString().slice(-6);

    // 3. Create Order
    const order = await Order.create({
      orderNumber, customerName, customerEmail, customerPhone, 
      shippingAddress, city, totalAmount, paymentMethod, notes
    });

    // 4. Create Order Items
    for (const item of orderItemsData) {
      await OrderItem.create({ orderId: order.id, ...item });
    }

    // 5. Send Emails
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    // Email to Admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `🛒 New Order: ${orderNumber}`,
      html: `
        <h2>New Order Received</h2>
        <p><b>Order:</b> ${orderNumber}</p>
        <p><b>Customer:</b> ${customerName} (${customerEmail})</p>
        <p><b>Phone:</b> ${customerPhone}</p>
        <p><b>Address:</b> ${shippingAddress}, ${city}</p>
        <p><b>Payment:</b> ${paymentMethod}</p>
        <h3>Items:</h3>
        <ul>${items.map(i => `<li>${i.name} x ${i.quantity} - KES ${(i.price * i.quantity).toLocaleString()}</li>`).join('')}</ul>
        <h3>Total: KES ${totalAmount.toLocaleString()}</h3>
      `
    });

    // Email to Customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <h2>Thank you for your order, ${customerName}!</h2>
        <p>Order Number: <b>${orderNumber}</b></p>
        <p>Total Amount: <b>KES ${totalAmount.toLocaleString()}</b></p>
        <p>We will contact you shortly to confirm delivery.</p>
        <br/>
        <p>Best regards,<br/>Bluewell Horizon Team</p>
      `
    });

    res.status(201).json({ message: 'Order placed successfully', orderNumber, orderId: order.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};