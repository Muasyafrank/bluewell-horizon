const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  orderNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
  customerId: { type: DataTypes.INTEGER, allowNull: true },
  customerName: { type: DataTypes.STRING, allowNull: false },
  customerEmail: { type: DataTypes.STRING, allowNull: false },
  customerPhone: { type: DataTypes.STRING, allowNull: false },
  
  // Kenyan address fields
  county: { type: DataTypes.STRING, allowNull: false },
  constituency: { type: DataTypes.STRING, allowNull: true }, // <-- FIXED
  estate: { type: DataTypes.STRING, allowNull: false },
  streetAddress: { type: DataTypes.STRING, allowNull: false },
  buildingName: { type: DataTypes.STRING, allowNull: true }, // <-- FIXED
  apartmentNumber: { type: DataTypes.STRING, allowNull: true }, // <-- FIXED
  poBox: { type: DataTypes.STRING, allowNull: true }, // <-- FIXED
  postalCode: { type: DataTypes.STRING, allowNull: true }, // <-- FIXED
  
  // Delivery options
  deliveryMethod: { type: DataTypes.STRING, defaultValue: 'standard' },
  deliveryFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  
  // Payment
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
  mpesaPhone: { type: DataTypes.STRING, allowNull: true }, // <-- FIXED
  mpesaReference: { type: DataTypes.STRING, allowNull: true }, // <-- FIXED
  
  // Order details
  subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  vatAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  orderStatus: { type: DataTypes.STRING, defaultValue: 'processing' },
  notes: { type: DataTypes.TEXT, allowNull: true },
  
  // Business info
  companyName: { type: DataTypes.STRING, allowNull: true }, // <-- FIXED
  kraPin: { type: DataTypes.STRING, allowNull: true } // <-- FIXED
}, { tableName: 'orders' });

module.exports = Order;