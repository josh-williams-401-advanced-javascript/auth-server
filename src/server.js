'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();


const router = require('./auth/routes');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use(router);


module.exports = {
  server: app,
  start: (port = process.env.PORT || 3001) => {
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};

