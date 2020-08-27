'use strict';

const superagent = require('superagent');
const users = require('../models/users/users-schema');

module.exports = async (req, res, next) => {
  try {
    const code = await req.query.code;

    let access_token = await getToken(code);

    let oauthUser = await userResponse(access_token);

    let user = await users.createFromOauth(oauthUser.login);
    let signed = await user.generateToken();
    req.token = signed;
    req.user = user;
    next();

  } catch (e) {
    next(e);
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
    .set('Authorization', `token ${token}`);
  let user = userRetrieval.body;
  return user;
}