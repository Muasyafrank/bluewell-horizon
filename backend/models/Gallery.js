const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Gallery = sequelize.define('Gallery', {
  title: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'galleries' });

module.exports = Gallery;