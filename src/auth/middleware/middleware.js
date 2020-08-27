'use strict';

const base64 = require('base-64');
const users = require('../models/users/users-schema');

const auth = async (req, res, next) => {
  if (!req.headers.authorization) {
    next('Invalid Login');
  }
  let userNameAndPassword = await req.headers.authorization
    .split(' ')
    .pop();
  let [username, password] = await base64
    .decode(userNameAndPassword)
    .split(':');
  try {
    let { token, user } = await users.authenticateBasic(username, password);
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    next({ 'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized' });
  }
};

module.exports = auth;