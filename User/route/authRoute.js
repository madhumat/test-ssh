const express = require('express');
var authRoute = express.Router();
const authController = require('../controller/authController.js');

authRoute.post('/signup', authController.signup);
authRoute.post('/login', authController.login);
authRoute.post('/tempPassword',authController.tempPassword);
authRoute.post('/resetPassword',authController.resetPassword);

module.exports = authRoute;