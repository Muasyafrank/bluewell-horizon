const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProcessStep = sequelize.define('ProcessStep', {
  stepNumber: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT }
}, { tableName: 'process_steps' });

module.exports = ProcessStep;