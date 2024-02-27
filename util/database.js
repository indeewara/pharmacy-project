const { Sequelize } = require('sequelize');
const path = require('path');
const dbPath = path.resolve(__dirname, 'pharmacy.db');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath
});

module.exports = sequelize;
