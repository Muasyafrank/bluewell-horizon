const Quote = require('../models/Quote');
const nodemailer = require('nodemailer');

exports.submitQuote = async (req, res) => {
    try {
        const { name, email, phone, companyName, serviceType, projectDetails } = req.body;

        await Quote.create({ name, email, phone, companyName, serviceType, projectDetails });

        // send email notification to the admin
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New Quote Request: ${serviceType} - ${companyName}`,
            html: `
        <h2>New Quote Request Received</h2>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Company:</strong> ${companyName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Service Needed:</strong> ${serviceType}</p>
          <p><strong>Project Details:</strong></p>
          <p style="padding: 15px; background-color: #ffffff; border-left: 4px solid #2fa5b6; border-radius: 4px;">${projectDetails}</p>
        </div>
        <p style="color: #718096; font-size: 14px;">Please review this request in your admin dashboard or reply directly to the client.</p>
      `

        });
        res.status(200).json({ message: 'Quote request submitted successfully.'});
    }catch (error){
        console.error('Quote submission error:', error);
        res.status(500).json({ message: 'Server error',error: error.message})
    }
}