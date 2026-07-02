const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Technology = sequelize.define('Technology', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  icon: { type: DataTypes.STRING, defaultValue: 'FaCogs' },
  image: { type: DataTypes.STRING }
}, { tableName: 'technologies' });

module.exports = Technology;