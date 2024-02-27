const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const bcrypt = require('bcryptjs');


const authenticateUser = async (req, res, next) => {
    try {
        let userData;
        const { username, password } = req.body;
        if (username && password) {
            const existingUser = await User.findOne({ where: { username } });
            if (!existingUser) {
                throw new HttpError('Could not identify user. Credentials seem to be wrong.', 401);
            }

            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                throw new HttpError('Could not identify user. Credentials seem to be wrong.', 401);
            }

            userData = { userId: existingUser.id, role: existingUser.role };
        } else {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                throw new HttpError('Authentication failed. Please provide valid credentials or JWT token.', 401);
            }

            try {
                const decodedToken = jwt.verify(token, 'your-secret-key');
                userData = { userId: decodedToken.userId, role: decodedToken.role };
            } catch (error) {
                throw new HttpError('Authentication failed. Invalid JWT token.', 401);
            }
        }

        const newToken = jwt.sign(userData, 'your-secret-key', { expiresIn: '1h' });
        res.locals.token = newToken;
        req.userData = userData;

        next();
    } catch (error) {
        return next(new HttpError(error.message, error.code || 500));
    }
};

module.exports = authenticateUser;
