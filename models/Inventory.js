const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');


sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1); 
  });


  const Inventory = sequelize.define('Inventory', {
    name: {type : DataTypes.STRING , allowNull : true},
    description: {type : DataTypes.STRING, allowNull : true},
    quantity: {type : DataTypes.INTEGER , allowNull : true},
    expirationDate: { type: DataTypes.DATE, allowNull: true },
    manufacturer: { type: DataTypes.STRING, allowNull: true },
    status: { 
        type: DataTypes.ENUM('ACTIVE', 'DEACTIVE'), 
        defaultValue: 'ACTIVE' 
    }, 
  },{
   tableName: 'inventories',
  });


  module.exports = Inventory;
