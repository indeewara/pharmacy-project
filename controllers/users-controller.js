const uuid = require('uuid').v4;

const { validationResult } = require('express-validator');

const HttpError = require('./../models/http-error');

const User = require('../models/user');

const bcrypt = require('bcrypt');




const signup = async (req, res, next) => {
 
  const error = validationResult(req);

  if(!error.isEmpty()){
    console.log(error);
     return next(new HttpError('Invalid Inputs Passed , please check your data', 422));

  }

  const { name,username,role,password,email,birthday} = req.body;

  let existingUser;
  try{
     existingUser = await User.findOne({ where : {username: username}});
  }catch(e){
       return next(new HttpError('Failed , Please Try Again',e.message,500));
  }

console.log(existingUser);
  if(existingUser){
    return next(new HttpError('User Aleady Existing , Please Login',422));
  }

  const createdUser =  User.build ({
    name,
    username,
    email,
    password,
    role,
    birthday
  });



  try {
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(createdUser.password, saltRounds);
    createdUser.password = hashedPassword;
  } catch (err) {
    const error = new HttpError('Error hashing password: ' + err.message, 500);
    return next(error);
  }
  

  try{

    await createdUser.save();

  }catch(err){

    const error = new HttpError('Creating User Failed Please Try Again'+err, 500);

    return next(error);

  }


  res.status(201).json({"message": "User created successfully"});

};


const getUsers = async (req, res, next) => {


  let users;
  try{
   users =  await User.findAll();

  }catch(e){
    return next(new HttpError('Failed , Please Try Again',500));
  }

  res.status(200).json({ users : users.map(user => user.get({plain :true})) });

};


const login = async (req, res, next) => {
    const {username, password} = req.body;

    let existingUser;
    try{
       existingUser = await User.findOne({where : {username: username}});
    }catch(e){
         return next(new HttpError('Failed , Please Try Again',500));
    }


    try {
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
      if (!passwordMatch) {
          return next(new HttpError('Could not identify user, Credentials seem to be wrong', 401));
      }
  } catch (error) {
      return next(new HttpError('Failed, Please Try Again', 500));
  }


   res.json({message : 'Logged in successfully'});
};



const logout = (req, res) => {

  localStorage.removeItem('token');
    res.status(200).json({ message: 'Logout successful'});
};




exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.logout = logout;

