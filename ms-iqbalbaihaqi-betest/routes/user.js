const UserController = require('../controller/userController');

const userRoutes = require('express').Router()

userRoutes.get('/', UserController.findAll)

userRoutes.post('/', UserController.create)

module.exports = userRoutes;