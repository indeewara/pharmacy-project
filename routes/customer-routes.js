const { json } = require('body-parser');
const express = require('express');
const { check } = require('express-validator');
const HttpError = require('../models/http-error');
const CustomerControllers = require('../controllers/customer-controller');
const authenticateUser = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateUser);

router.post('/InsertCustomers',authenticateUser,CustomerControllers.instertCustomers);
router.get('/GetCustomers',authenticateUser,CustomerControllers.getCustomers);
router.patch('/UpdateCustomers/:cusID',authenticateUser,CustomerControllers.updateCustomersById);
router.post('/SoftDeleteCustomers/:cusID',authenticateUser,CustomerControllers.softDelete);
router.post('/DeleteCustomers/:cusID',authenticateUser,CustomerControllers.Delete);


module.exports = router ;