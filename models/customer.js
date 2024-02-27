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


  const Customer = sequelize.define('Customer', {
    name: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true },
    gender: { type: DataTypes.ENUM('Male', 'Female'), allowNull: false },
    dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true },
    status: { 
        type: DataTypes.ENUM('ACTIVE', 'DEACTIVE'), 
        defaultValue: 'ACTIVE' 
    },
}, {
    tableName: 'customers',
});


module.exports = Customer;