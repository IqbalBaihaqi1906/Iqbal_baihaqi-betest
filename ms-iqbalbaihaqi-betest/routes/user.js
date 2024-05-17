const UserController = require('../controller/userController');

const userRoutes = require('express').Router()

userRoutes.get('/:id', UserController.findOne)
userRoutes.get('/', UserController.findAll)

userRoutes.post('/', UserController.create)
userRoutes.patch('/:id', UserController.update)
userRoutes.delete('/:id', UserController.deleteOne)

module.exports = userRoutes;