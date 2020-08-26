'use strict';

const express = require('express');
const router = express.Router();
const auth = require('./middleware/middleware');
const oauth = require('./middleware/oauth');
const schema = require('./models/users/users-schema');
require('ejs');

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
    console.log(encoded);
    URL += `${key}=${encoded}&`;
  }
  // URL.split('').pop().join();
  console.log(URL);

  res.send(`<a href=${URL}>Login</a>`);
});

router.post('/signup', async (req, res, next) => {
  try {
    let user = new schema(req.body);
    let saved = await user.save(user);
    console.log(saved);
    res.status(201).send(`Created user ${saved.username}`);
  } catch (e) {
    res.status(403).send('Error creating user');
  }
});

router.post('/signin', auth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.status(200).json({ token: req.token, user: req.user });
});

router.get('/users', async (req, res) => {
  let users = await schema.findAll();
  res.status(200).json(users);
});

router.get('/oauth', oauth, async (req, res) => {
  res.status(200).json({ user: req.user, token: req.token });
});

module.exports = router;