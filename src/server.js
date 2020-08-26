'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
require('ejs');

const router = require('./auth/routes');

app.use(cors());
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.use(router);

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

