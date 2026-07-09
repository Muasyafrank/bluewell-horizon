const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/auth');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const Contact = require('../models/Contact');

router.use(protect);

// Dashboard Statistics

router.get('/stats', async (req, res) =>{
  try{
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where:{orderStatus: 'processing'}});
    const completedOrders = await Order.count({ where:{ orderStatus: 'delivered'}});
    const totalInquiries = await Contact.count();
    const unreadInquiries = await Contact.count({ where: { isRead: false}});
    const totalProducts = await Product.count();

    const orders = await Order.findAll({
        attributes:['totalAmount', 'orderStatus']
    });

    const totalRevenue = orders.reduce((sum,order)=>{
        return sum + parseFloat(order.totalAmount);
    },0);

    const monthlyRevenue = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        const now = new Date();
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    }).reduce((sum,order) => sum + parseFloat(order.totalAmount),0);

    res.json({
        totalOrders,
        pendingOrders,
        completedOrders,
        totalInquiries,
        unreadInquiries,
        totalProducts,
        totalRevenue,
        monthlyRevenue
    });

  }  catch (error){
    res.status(500).json({ message: error.message });
  } 
});

// management of the orders

router.get('/orders', async (req, res) =>{
    try{
        const orders = await Order.findAll({
            order:[['createdAt', 'DESC']]
        })
        res.json(orders);
    } catch (error){
        res.status(500).json({ message: error.message });
    }
})

// handling single order and its item

router.get('/orders/:id', async (req, res) =>{
    try{
        const order = await Order.findByPk(req.params.id);
        if(!order) return res.status(404).json({ message: 'Order not Found'});

        const items = await OrderItem.findAll({
            where:{ orderId: order.id },
            include: [{ model: Product, attributes: ['name', 'image', 'category']}]

        });
        res.json({ order, items});
    } catch (error){
        res.status(500).json({ message: error.message });
    }
});

// order status update

router.put('/orders/:id', async (req, res)=>{
    try{
        const { status } = req.body;
        const order = await Order.findByPk(req.params.id);

        if(!order) return res.status(404).json({ message: 'Order not Found'});

        validStatues = ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if(!validStatues.includes(status)) {
            return res.status(400).json({ message: 'Invalid Status'});

        }

        await order.update({ orderStatus: status});
        // sending emails
        try{
            const transporter = nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            const statusMessages = {
                processing: 'Your order is being processed.',
                confirmed: 'Your order has been confirmed and is being prepared.',
                shipped: 'Your order has been shipped and is on its way!',
                delivered: 'Your order has been delivered. Thank you for choosing Bluewell Horizon!',
                cancelled: 'Your order has been cancelled. Please contact us for more information.'
             };
            
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: order.customerEmail,
                subject: `Order Update - ${order.orderNumber}`,
                html: `
                <h2>Order Status Update</h2>
                <p>Dear ${order.customerName},</p>
                <p>Your order <strong>${order.orderNumber}</strong> status has been updated to: <strong style="color: #2fa5b6; text-transform: uppercase;">${status}</strong></p>
                <p>${statusMessages[status]}</p>
                <p>For any inquiries, contact us at 0721-633-223 or bluewellsynergy@gmail.com</p>
                <br/>
                <p>Best regards,<br/>Bluewell Horizon Team</p>
        `
      }); 
        } catch (emailError){
           console.error('Email notification failed:', emailError.message); 
        }
        res.json({ message : `Order status updated to ${status}`, order });
    } catch (error){
        res.status(500).json({ message: error.message});
    }
});

// deleting an order

router.delete('/orders/:id', async (req, res) =>{
    try{
        const order = await Order.findByPk(req.params.id);
        if(!order) return res.status(404).json({ message: 'Order not Found'});

        await OrderItem.destroy({ where : { orderId: order.id }});
        await order.destroy();
        res.json({ message: 'Order deleted successfully'});
    } catch (error){
        res.status(500).json({ message: error.message});
    }
});

// all inquiries

router.get('/contacts', async (req, res) =>{
    try{
        const contacts = await Contact.findAll({
            order:[['createdAt', 'DESC']]
        })
        res.json(contacts);
    } catch (error){
        res.status(500).json({ message: error.message });
    }
});

// mark all enquiries as read

router.put('/contacts/:id/read', async (req, res) =>{
    try{
        const contact = await Contact.findByPk(req.params.id);
        if(!contact) return res.status(404).json({ message: 'Inquiry not Found'});

        await contact.update({ isRead:true });
        res.json({ message: 'Inquiry marked as read', contact });

    } catch (error){
        res.status(500).json({ message: error.message });
    }
});

// delete inquiry

router.delete('/contacts/:id', async (req, res) =>{
    try{
        const contact = await Contact.findByPk(req.params.id);
        if(!contact) return res.status(404).json({ message: 'Inquiry not Found'});

        await contact.destroy();
        res.json({ message: 'Inquiry deleted successfully'});
    } catch (error){
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
