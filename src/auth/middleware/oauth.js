'use strict';

const superagent = require('superagent');
const users = require('../models/users/users-schema');

module.exports = async (req, res, next) => {
  try {
    const code = await req.query.code;
    console.log('code', code);
    let token = await getToken(code);
    console.log('token', token);
    let oauthUser = await userResponse(token);

    let allUsers = await users.findAll();

    // See if the user is already in the database based on username
    let isInDbAlready = allUsers.filter(user => user.username === oauthUser.login);
    if(!isInDbAlready.length) {
      const newUserObj = {username: oauthUser.login, password: 'password', fullname: oauthUser.name };
      // Add user to db
      let user = new users(newUserObj);
      let saved = await user.save(user);
      // Make a token
      let signed = await saved.generateToken();
      req.token = signed;
      req.user = user;
      next();
    } else {
      // Make a token for req obj for user already in db
      let signed = await isInDbAlready[0].generateToken();
      req.token = signed;
      req.user = isInDbAlready[0];
      next();
    }
  } catch (e) {
    next('Oauth Failed');
  }
};

async function getToken(code) {
  let tokenRetrieval = await superagent.post('https://github.com/login/oauth/access_token')
    .send({
      code: code,
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      redirect_uri: 'http://localhost:3000/oauth',
      grant_type: 'authorization_code',
    });
  return await tokenRetrieval.body.access_token;
}

async function userResponse(token) {
  let userRetrieval = await superagent.get('https://api.github.com/user')
    .set('user-agent', 'express-app')
    .set('Authorization',`token ${token}`);
  let user = userRetrieval.body;
  return user;
}