const { json } = require('body-parser');
const express = require('express');
const HttpError = require('./../models/http-error');
const usersControllers = require('./../controllers/users-controller');
const { check } = require('express-validator');
const authenticateUser = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/login', authenticateUser, (req, res, next) => {
    res.status(200).json({ message: 'Login successful', token: res.locals.token });
    console.log(req.userData);
});

router.get('/',authenticateUser,usersControllers.getUsers);

router.post('/signup',[check('name').not().isEmpty(), check('password').isLength({min:6}), check('email').normalizeEmail().isEmail()],usersControllers.signup);

router.get('/logout',usersControllers.logout);


module.exports = router ;