'use strict';

const User = require('../users-schema');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    next('Invalid Login: Missing Headers');
  }
  let token = req.headers.authorization.split(' ').pop();
  try {
    const user = await User.authenticateToken(token);
    req.user = {
      username: user.username,
      role: user.role,
      capabilities: user.capabilities,
    };
    next();
  } catch (e) {
    next(e);
  }
};

