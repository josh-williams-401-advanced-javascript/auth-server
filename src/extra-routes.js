'use strict';

const express = require('express');
const router = express.Router();
const bearerMiddleware = require('./auth/middleware/bearer-auth');

router.get('/secret', bearerMiddleware, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;
