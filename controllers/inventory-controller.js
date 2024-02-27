const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Inventory = require('../models/Inventory');

const instertItems = async (req, res, next) => {

    if (req.userData.role !== 'owner') {
        return next(new HttpError('Authentication failed. Only Owners Can Perform this action.', 401));
    }
 
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input data. Please check your inputs.', 422));
    }

    const { name, description, quantity, expirationDate, manufacturer } = req.body;

    try {
        const inventoryItem = await Inventory.create({
            name,
            description,
            quantity,
            expirationDate,
            manufacturer
        });

        res.status(201).json({ inventoryItem });
    } catch (err) {
        console.error('Error adding item to inventory:', err);
        return next(new HttpError(error.message, error.code || 500));
    }
};


const getItems = async (req, res,next) => {

  let items;

  try {
    items = await Inventory.findAll({
        where: {
            status: 'ACTIVE'
        }
    });

  }catch(e) {
    console.error('Error adding item to inventory:', err);
    const error = new HttpError('Failed Get Items. Please try again later.', 500);
    return next(error);

  }

  res.status(201).json({items});

};


const updateItemsById = async (req, res, next) => {


    if (req.userData.role !== 'owner' || req.userData.role !== 'manager' || req.userData.role !== 'cashier') {
        return next(new HttpError('Authentication failed. Only Owners , Managers and Cashiers Can Perform this action.', 401));
    }
 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input data. Please check your inputs.', 422));
    }

    const { name, description, quantity, expirationDate, manufacturer } = req.body;
    const itemId = req.params.itemID;

    try {
        let item = await Inventory.findByPk(itemId);
        
        if (!item || item.status === 'DEACTIVE') {
            return next(new HttpError('Inventory item not found.', 404));
        }

        item.name = name;
        item.description = description;
        item.quantity = quantity;
        item.expirationDate = expirationDate;
        item.manufacturer = manufacturer;

        await item.save();

        res.status(200).json({ item });
    } catch (error) {
        console.error('Error updating item:', error);
        return next(new HttpError('Failed to update item. Please try again later.', 500));
    }
};



const softDelete = async (req, res, next) => {

    if (req.userData.role !== 'owner' || req.userData.role !== 'manager') {
        return next(new HttpError('Authentication failed. Only Owners and Managers Can Perform this action.', 401));
    }
 

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input data. Please check your inputs.', 422));
    }

    const itemId = req.params.itemID;

    try {
        let item = await Inventory.findByPk(itemId);
       
        item.status = 'DEACTIVE';
    
        await item.save();

        res.status(200).json({ "message" : "item deleted succesfully !" });
    } catch (error) {
        console.error('Error Deleting item:', error);
        return next(new HttpError('Failed to delete item. Please try again later.', 500));
    }
};



const Delete = async (req, res, next) => {

    if (req.userData.role !== 'owner') {
        return next(new HttpError('Authentication failed. Only Owners Can Perform this action.', 401));
    }
 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input data. Please check your inputs.', 422));
    }

    const itemId = req.params.itemID;

    try {
        let item = await Inventory.findByPk(itemId);
       
        await item.destroy();

        res.status(200).json({ "message" : "item Permanatly deleted succesfully !" });
    } catch (error) {
        console.error('Error Deleting item:', error);
        return next(new HttpError('Failed to delete item. Please try again later.', 500));
    }
};








module.exports = {
    instertItems , getItems ,updateItemsById,softDelete ,Delete
};
