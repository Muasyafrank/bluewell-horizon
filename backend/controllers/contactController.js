const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    
    // Create contact with isRead set to false (new inquiry)
    await Contact.create({ 
      name, 
      email, 
      phone, 
      service, 
      message, 
      isRead: false 
    });

    // Send email notification to admin
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Inquiry: ${service}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 10px 0;"><strong>Phone:</strong> ${phone}</p>
          <p style="margin: 10px 0;"><strong>Service:</strong> ${service}</p>
          <p style="margin: 10px 0;"><strong>Message:</strong></p>
          <p style="margin: 10px 0; padding: 15px; background-color: #ffffff; border-left: 4px solid #2fa5b6; border-radius: 4px;">${message}</p>
        </div>
        <p style="color: #718096; font-size: 14px;">This inquiry has been saved to your admin dashboard.</p>
      `
    });

    // Send confirmation email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thank you for contacting Bluewell Horizon - ${service}`,
      html: `
        <h2>Thank you for reaching out, ${name}!</h2>
        <p>We have received your inquiry regarding <strong>${service}</strong> and our team will get back to you within 24 hours.</p>
        <p>For urgent matters, please call us at <strong>0721-633-223</strong> or <strong>0731-836-349</strong>.</p>
        <br/>
        <p>Best regards,<br/><strong>Bluewell Horizon Team</strong></p>
        <p style="color: #718096; font-size: 12px; margin-top: 20px;">
          Bluewell Horizon Limited<br/>
          Harambee Estate, Nairobi<br/>
          www.bluewellhorizonlimited.com
        </p>
      `
    });

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};