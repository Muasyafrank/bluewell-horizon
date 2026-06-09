const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// The function must be exported correctly
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    // 1. Save to PostgreSQL Database
    await Contact.create({ name, email, phone, service, message });

    // 2. Send Email Notification to Admin
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${service}`,
      html: `
        <h3>New Inquiry from ${name}</h3>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // 3. Send Auto-Reply to the User
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Bluewell Horizon Limited',
      html: `
        <h3>Dear ${name},</h3>
        <p>Thank you for reaching out to Bluewell Horizon Limited regarding <strong>${service}</strong>.</p>
        <p>We have received your message and our team will get back to you within 24 hours.</p>
        <p>Best regards,<br/>Bluewell Horizon Team</p>
      `,
    };
    await transporter.sendMail(userMailOptions);

    res.status(201).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};