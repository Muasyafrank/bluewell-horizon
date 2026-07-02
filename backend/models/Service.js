const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Service = sequelize.define('Service', {
  title: { type: DataTypes.STRING, allowNull: false },
  shortDesc: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  icon: { type: DataTypes.STRING, defaultValue: 'FaTint' },
  image: { type: DataTypes.STRING },
  features: { type: DataTypes.JSON, defaultValue: [] },      // Array of strings
  applications: { type: DataTypes.JSON, defaultValue: [] },  // Array of objects {name, icon}
  benefits: { type: DataTypes.TEXT }
}, { tableName: 'services' });

module.exports = Service;