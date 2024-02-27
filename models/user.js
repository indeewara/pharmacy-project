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


const User = sequelize.define('User', {
    name: {type : DataTypes.STRING , allowNull : false},
    username: {type : DataTypes.STRING, allowNull : false},
    password: {type : DataTypes.STRING , allowNull : false},
    role: {type : DataTypes.ENUM('owner','manager','cashier') , allowNull : false},
    email:{type : DataTypes.STRING , allowNull : true},
    birthday: {type : DataTypes.STRING , allowNull : true},
  },{
   tableName: 'users',
  });;

module.exports = User;