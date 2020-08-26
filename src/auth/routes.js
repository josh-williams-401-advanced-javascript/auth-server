'use strict';

const express = require('express');
const router = express.Router();
const superagent = require('superagent');
const auth = require('./middleware/middleware');
const oauth = require('./middleware/oauth');
const schema = require('./models/users/users-schema');
require('ejs');

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
  res.status(200).json({token: req.token, user: req.user});
});

router.get('/users', async (req,res) => {
  let users = await schema.findAll();
  res.status(200).json(users);
});

router.get('/oauth', oauth, async (req, res) => {
  res.status(200).json({user:req.user, token: req.token});
});

module.exports = router;