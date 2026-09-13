const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

exports.checkout = async (req, res) => {
  try {
    console.log("📦 Checkout request received. Body:", req.body); // DEBUG LOG

    const {
      customerName, customerEmail, customerPhone, companyName, kraPin,
      county, constituency, estate, streetAddress, buildingName, apartmentNumber,
      poBox, postalCode, deliveryMethod, paymentMethod, mpesaPhone, mpesaReference,
      notes, items, subtotal, deliveryFee, vatAmount, totalAmount
    } = req.body;

    // Check if user is logged in
    let customerId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        customerId = decoded.id;
      } catch (err) {
        console.log("Token invalid or expired, proceeding as guest");
      }
    }

    // Generate order number
    const orderNumber = `BW-${Date.now()}`;

    // Create order
    const order = await Order.create({
      orderNumber,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      companyName: companyName || null,
      kraPin: kraPin || null,
      county,
      constituency: constituency || null,
      estate,
      streetAddress,
      buildingName: buildingName || null,
      apartmentNumber: apartmentNumber || null,
      poBox: poBox || null,
      postalCode: postalCode || null,
      deliveryMethod: deliveryMethod || 'standard',
      deliveryFee: deliveryFee || 0,
      paymentMethod,
      mpesaPhone: mpesaPhone || null,
      mpesaReference: mpesaReference || null,
      subtotal,
      vatAmount: vatAmount || 0,
      totalAmount,
      notes: notes || null,
      orderStatus: 'processing'
    });

    // Create order items
    if (items && Array.isArray(items)) {
      for (const item of items) {
        await OrderItem.create({
          orderId: order.id,
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        });

        // Update product stock
        await Product.decrement('stock', {
          by: item.quantity,
          where: { id: item.id }
        });
      }
    }

    // Send email notification
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: `Order Confirmation - ${orderNumber}`,
        html: `
          <h2>Thank you for your order!</h2>
          <p>Dear ${customerName},</p>
          <p>Your order <strong>${orderNumber}</strong> has been received and is being processed.</p>
          <p><strong>Total Amount:</strong> KES ${parseFloat(totalAmount).toLocaleString()}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p>We will contact you shortly with delivery details.</p>
          <br/>
          <p>Best regards,<br/>Bluewell Horizon Team</p>
        `
      });
    } catch (emailError) {
      console.error('Email notification failed:', emailError.message);
    }

    res.status(201).json({ 
      message: 'Order placed successfully', 
      orderNumber 
    });
  } catch (error) {
    console.error('❌ Checkout error:', error); // THIS WILL SHOW THE EXACT ERROR
    res.status(500).json({ 
      message: 'Error placing order', 
      error: error.message 
    });
  }
};