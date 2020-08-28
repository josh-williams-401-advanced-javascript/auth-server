'use strict';

const User = require('../models/users/users-schema');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    next('Invalid Login: Missing Headers');
  }
  let token = req.headers.authorization.split(' ').pop();
  try {
    const user = await User.authenticateToken(token);
    req.user = user;
    next();
  } catch (e) {
    next('Invalid Login');
  }
};

