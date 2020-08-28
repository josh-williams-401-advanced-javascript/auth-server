'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const extraRoutes = require('./extra-routes');
const router = require('./auth/routes');
const routeError = require('./auth/errors/404');
const errorHandler = require('./auth/errors/500');

app.use(cors());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(router);
app.use(extraRoutes);

app.use('*',routeError);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (port = process.env.PORT || 3001) => {
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};

