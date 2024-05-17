const mainRoutes = require('express').Router()
const userRoutes = require('./user')

mainRoutes.get('/', (req, res) => {
  res.status(200).json({
    message: 'Main route is ready!'
  })
})

mainRoutes.use('/users', userRoutes)

module.exports = mainRoutes;
