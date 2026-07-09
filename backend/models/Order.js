const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  orderNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
  customerId: {type:DataTypes.INTEGER, allowNull:true},
  customerName: { type: DataTypes.STRING, allowNull: false },  
  customerEmail: { type: DataTypes.STRING, allowNull: false },
  customerPhone: { type: DataTypes.STRING, allowNull: false },
  shippingAddress: { type: DataTypes.TEXT, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
  orderStatus: { type: DataTypes.STRING, defaultValue: 'processing' },
  notes: { type: DataTypes.TEXT }
}, { tableName: 'orders' });

module.exports = Order;