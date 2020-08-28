'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const extraRoutes = require('./extra-routes');
const router = require('./auth/routes');

app.use(cors());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(router);
app.use(extraRoutes);

app.use((err,req,res,next) => {
  res.status(500).send(err);
  res.end();
});

module.exports = {
  server: app,
  start: (port = process.env.PORT || 3001) => {
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};

