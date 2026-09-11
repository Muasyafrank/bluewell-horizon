const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // <-- MAKE SURE THIS IS HERE
const sequelize = require('./config/db');

// Import Models
require('./models/Admin');
require('./models/Contact');
require('./models/Product');
require('./models/Service');
require('./models/Gallery');
require('./models/Order');
require('./models/OrderItem');
require('./models/Technology');
require('./models/ProcessStep');
require('./models/Customer');
require('./models/Quote');


// Import Routes
const adminManagementRoutes = require('./routes/adminManagementRoutes')
const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const customerRoutes = require('./routes/customerRoutes');
const quoteRoutes = require('./routes/quoteRoutes');


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/upload', uploadRoutes); 
app.use('/api/admin', adminManagementRoutes);
app.get('/', (req, res) => res.send('Bluewell Horizon API is running...'));
app.use('/api/customers', customerRoutes);
app.use('/api/quotes', quoteRoutes);
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected Successfully');
    await sequelize.sync({ alter: true }); 
    console.log('✅ Database tables synced');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();