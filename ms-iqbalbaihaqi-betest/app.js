require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connect = require('./connection/mongodb');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
)

connect();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})