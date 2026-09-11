const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Quote = sequelize.define('Quote',{
    name:{type: DataTypes.STRING, allowNull: false},
    email:{type: DataTypes.STRING, allowNull: false},
    phone :{type: DataTypes.STRING, allowNull: false},
    companyName: {type: DataTypes.STRING, allowNull: false},
    serviceType: {type: DataTypes.STRING, allowNull: false},
    projectDetails: {type: DataTypes.TEXT, allowNull: false},
    status:{type: DataTypes.STRING, defaultValue: 'pending'}
}, {tableName: 'quotes'});

module.exports = Quote;
