const { json } = require('body-parser');
const express = require('express');
const { check } = require('express-validator');
const HttpError = require('../models/http-error');
const InvantoryControllers = require('../controllers/inventory-controller');
const authenticateUser = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/InsertItems',authenticateUser,InvantoryControllers.instertItems);
router.get('/GetItems',authenticateUser,InvantoryControllers.getItems);
router.patch('/UpdateItems/:itemID',authenticateUser,InvantoryControllers.updateItemsById);
router.post('/SoftDeleteItems/:itemID',authenticateUser,InvantoryControllers.softDelete);
router.delete('/DeleteItems/:itemID',authenticateUser,InvantoryControllers.Delete);




module.exports = router ;