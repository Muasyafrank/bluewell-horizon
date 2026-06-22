const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

// Import ALL Models to register them with Sequelize
require('./models/Admin');
require('./models/Contact');
require('./models/Product');
require('./models/Service');
require('./models/Gallery');
require('./models/Order');      // <-- NEW
require('./models/OrderItem');  // <-- NEW

// Import Routes
const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes'); // <-- NEW

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes); // <-- NEW

app.get('/', (req, res) => res.send('Bluewell Horizon API is running...'));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected Successfully');
    
    // Note: We use alter: true here so it doesn't wipe data on normal restarts
    await sequelize.sync({ alter: true }); 
    console.log('✅ Database tables synced');
    
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();