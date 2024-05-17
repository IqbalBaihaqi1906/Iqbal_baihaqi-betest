require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connect = require('./connection/mongodb');
const errorHandler = require('./middlewares/error_handler');
const routes = require('./routes');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use('/api', routes);
connect();
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})