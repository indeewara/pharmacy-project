const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database'); 

const usersRoutes = require('./routes/users-routes');
const inventoryRoutes = require('./routes/inventory-routes');
const customerRoutes = require('./routes/customer-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/users', usersRoutes);
app.use('/api/inventory', inventoryRoutes); 
app.use('/api/customer', customerRoutes); 

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred!'});
});

sequelize.sync() 
  .then(() => {
    console.log('Database synced');
    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  })
  .catch(err => {
    console.error('Database sync error:', err);
  });