const express = require('express');
var userRoute = express.Router();
const userController = require('../controller/userController.js');

userRoute.route('/')
.get(userController.getAllUsers)
.post(userController.createUser);

module.exports = userRoute;