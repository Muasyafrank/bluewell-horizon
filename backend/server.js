const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db'); // Make sure this file exists in config/
const contactRoutes = require('./routes/contactRoutes'); // Make sure this file exists in routes/
require('./models/Contact'); // Make sure this file exists in models/


// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/contact', contactRoutes);

// Health Check Route
app.get('/', (req, res) => {
  res.send('Bluewell Horizon API is running...');
});

const PORT = process.env.PORT || 5000;

// Start Server and Sync Database
const startServer = async () => {
  try {
    await connectDB(); // Connect to Postgres
    await sequelize.sync({ alter: true }); // Creates/updates tables automatically
    console.log('Database tables synced successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();