const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/db');

const Product = sequelize.define('Product',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    price:{
        type:DataTypes.FLOAT,
        allowNull:false,
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    image:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    image:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    image:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    stock:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    features:{
        type:DataTypes.ARRAY(DataTypes.STRING),
        defaultValue:[],
    },
    specifications:{
        type:DataTypes.JSON,
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        defaultValue:true,
    },
},{
    timestamps:true,
    tableName:'products',
});
 
module.exports = Product;