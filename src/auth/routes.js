'use strict';

const express = require('express');
const router = express.Router();
const auth = require('./middleware/middleware');
const oauth = require('./middleware/oauth');
const UserModel = require('./users-schema');

router.get('/', (req, res) => {
  let URL = 'https://github.com/login/oauth/authorize?';
  let options = {
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: 'http://localhost:3000/oauth',
    scope: 'read:user',
    state: '401appconsent',
  };
  let encoded;
  for (let key in options) {
    encoded = encodeURIComponent(options[key]);
    URL += `${key}=${encoded}&`;
  }
  res.send(`<a href=${URL}>Login</a>`);
});

router.post('/signup', async (req, res, next) => {
  try {
    let user = new UserModel(req.body);
    let saved = await user.save(user);
    let token = await saved.generateToken();
    res.body = { user, token };
    res.status(201).json({user, token});
  } catch (e) {
    res.status(403).send('Error creating user');
  }
});

router.post('/signin', auth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.status(200).json({ token: req.token, user: req.user });
});

router.get('/users', async (req, res) => {
  let users = await UserModel.findAll();
  res.status(200).json(users);
});

router.get('/oauth', oauth, async (req, res) => {
  res.status(200).send(req.token);
});

module.exports = router;