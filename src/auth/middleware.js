'use strict';

const base64 = require('base-64');
const users = require('./models/users/users-schema');

const auth = async (req, res, next) => {
  if (!req.headers.authorization) {
    console.log('Invalid Login');
    res.status(500).send('Invalid Login');
  }
  let userNameAndPassword = req.headers.authorization
    .split(' ')
    .pop();
  let [username, password] = base64
    .decode(userNameAndPassword)
    .split(':');
  try {
    let { token, user } = await users.authenticateBasic(username, password);
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log('Invalid Login');
    res.status(500).send('Invalid Login');
  }
};

module.exports = auth;