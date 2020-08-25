'use strict';

const express = require('express');
const app = express();
require('dotenv').config();
const router = require('./auth/routes');

app.use(express.json());
app.use(router);


module.exports = {
  server: app,
  start: (port = process.env.PORT || 3001) => {
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};

