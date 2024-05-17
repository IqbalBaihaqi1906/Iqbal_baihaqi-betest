const UserController = require('../controller/userController');

const userRoutes = require('express').Router()

userRoutes.get('/identityNumber/:identityNumber', UserController.findByIdentityNumber)
userRoutes.get('/accountNumber/:accountNumber', UserController.findByAccountNumber)
userRoutes.get('/:id', UserController.findOne)
userRoutes.get('/', UserController.findAll)

userRoutes.post('/', UserController.create)
userRoutes.patch('/:id', UserController.update)
userRoutes.delete('/:id', UserController.deleteOne)

module.exports = userRoutes;