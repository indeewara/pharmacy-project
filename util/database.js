const { Sequelize } = require('sequelize');
const path = require('path');
const dbPath = path.resolve(__dirname, 'pharmacy.db');

console.log(dbPath);

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath
});

module.exports = sequelize;
