const UserController = require('../controller/userController');

const userRoutes = require('express').Router()

userRoutes.post('/', UserController.create)

module.exports = userRoutes;