const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Service = sequelize.define('Service', {
  title: { type: DataTypes.STRING, allowNull: false },
  shortDesc: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  icon: { type: DataTypes.STRING, defaultValue: 'FaTint' },
  image: { type: DataTypes.STRING }
}, { tableName: 'services' });

module.exports = Service;