const userRoutes = require('express').Router()

userRoutes.get('/', (req, res) => res.status(200).json({ message: 'User route is ready!' }))


module.exports = userRoutes;