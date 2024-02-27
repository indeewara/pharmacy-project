const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Customer = require('../models/customer');

const instertCustomers = async (req, res, next) => {

    if (req.userData.role !== 'owner') {
        return next(new HttpError('Authentication failed. Only Owners Can Perform this action.', 401));
    }
    console.log(req.userData)

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input data. Please check your inputs.', 422));
    }

    const { name, email, phone, address, gender,dateOfBirth } = req.body;

    try {
        const CustomerData = await Customer.create({
            name,
            email,
            phone,
            address,
            gender,
            dateOfBirth
        });

        res.status(201).json({ CustomerData });
    } catch (err) {
        console.error('Error Creating Customers:', err);
        const error = new HttpError('Failed to Create Customer. Please try again later.', 500);
        return next(error);
    }
};


const getCustomers = async (req, res,next) => {

  let items;

  try {
    items = await Customer.findAll({
        where: {
            status: 'ACTIVE'
        }
    });

  }catch(e) {
    console.error('Error Finding Customers:', err);
    const error = new HttpError('Failed Find Customers. Please try again later.', 500);
    return next(error);

  }

  res.status(201).json({items});

};



const updateCustomersById = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input data. Please check your inputs.', 422));
    }

    const { name, email, phone, address, gender,dateOfBirth } = req.body;
    const cusID = req.params.cusID;

    try {
        let customer = await Customer.findByPk(cusID);
        
        if (!customer || customer.status === 'DEACTIVE') {
            return next(new HttpError('Customer item not found.', 404));
        }

        customer.name = name;
        customer.email = email;
        customer.phone = phone;
        customer.address = address;
        customer.dateOfBirth = dateOfBirth;

        await customer.save();

        res.status(200).json({ customer });
    } catch (error) {
        console.error('Error updating Customer:', error);
        return next(new HttpError('Failed to update Customer. Please try again later.', 500));
    }
};



const softDelete = async (req, res, next) => {
   

    if (!(req.userData.role === 'owner' || req.userData.role === 'manager')) {
        return next(new HttpError('Authentication failed. Only Owners and Managers Can Perform this action.', 401));
    }
    

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input data. Please check your inputs.', 422));
    }

    const cusID = req.params.cusID;

    try {
        let customer = await Customer.findByPk(cusID);
       
        customer.status = 'DEACTIVE';
    
        await customer.save();

        res.status(200).json({ "message" : "customer deleted succesfully !" });
    } catch (error) {
        console.error('Error Deleting item:', error);
        return next(new HttpError('Failed to delete customer. Please try again later.', 500));
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

    const cusID = req.params.cusID;

    try {
        let customer = await Customer.findByPk(cusID);
       
        await customer.destroy();

        res.status(200).json({ "message" : "Customer Permanatly deleted succesfully !" });
    } catch (error) {
        console.error('Error Deleting Customer:', error);
        return next(new HttpError('Failed to delete Customer. Please try again later.', 500));
    }
};


module.exports = {
    instertCustomers , getCustomers ,updateCustomersById,softDelete ,Delete
};
