'use strict';

const base64 = require('base-64');
const users = require('./models/users/users-schema');

const auth = async (req, res, next) => {
  if(!req.headers.authorization) {
    console.log('Invalid Login');
    res.status(500).send('Invalid Login');
  }
  let userNameAndPassword = req.headers.authorization.split(' ').pop();
  let [username, password] = base64.decode(userNameAndPassword).split(':');
  console.log(username, password);
  let isValid = await users.authenticateBasic(username, password);
  if(isValid) {
    // make a token with users methods
  } else {
    console.log('Invalid Login');
    res.status(500).send('Invalid Login');
  }
};  

module.exports = auth;