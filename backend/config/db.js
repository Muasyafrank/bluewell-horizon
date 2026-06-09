const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host:process.env.DB_HOST,
        port:process.env.DB_PORT,
        dialect:'postgres',
        logging:false,
    }
);

const connectDB = async () =>{
    try{
        await sequelize.authenticate();
        console.log("PostgreSql Connected Successfully");
    } catch (error) {
        console.error("Error connecting to PostgreSql:", error);
        process.exit(1);
    }
};
module.exports = { sequelize, connectDB };