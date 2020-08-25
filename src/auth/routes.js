'use strict';

const express = require('express');
const router = express.Router();
const auth = require('./middleware');
const schema = require('./models/users/users-schema');

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

module.exports = router;