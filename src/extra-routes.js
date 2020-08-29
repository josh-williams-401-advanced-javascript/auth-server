'use strict';

const express = require('express');
const router = express.Router();
const bearerMiddleware = require('./auth/middleware/bearer-auth');
const permissions = require('./auth/middleware/authorize');

router.get('/public', (req, res, next) => {
  res.status(200).json('Route /public works');
});

router.get('/private', bearerMiddleware, (req, res, next) => {
  res.status(200).send('Route /private works');
});

router.get('/readonly', bearerMiddleware, permissions('read'), (req, res, next) => {
  res.status(200).send('Route /read works');
});

router.post('/create', bearerMiddleware, permissions('create'), (req, res, next) => {
  res.status(200).send('Route /add works');
});

router.put('/update', bearerMiddleware, permissions('update'), (req, res, next) => {
  res.status(200).send('Route /change works');
});

router.delete('/delete', bearerMiddleware, permissions('delete'), (req, res, next) => {
  res.status(200).send('Route /remove works');
});

module.exports = router;
