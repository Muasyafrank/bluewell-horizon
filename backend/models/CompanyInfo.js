const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CompanyInfo = sequelize.define('CompanyInfo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  aboutUs: { type: DataTypes.TEXT, allowNull: true },
  mission: { type: DataTypes.TEXT, allowNull: true },
  vision: { type: DataTypes.TEXT, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
  phone1: { type: DataTypes.STRING, allowNull: true },
  phone2: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.STRING, allowNull: true },
  website: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'company_info' });

module.exports = CompanyInfo;