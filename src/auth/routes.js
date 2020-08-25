'use strict';

const express = require('express');
const router = express.Router();
const auth = require('./middleware'); // look at auth middleware in demo
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
  res.status(200).send(req.headers);
});

//   // send bcak token -- req.token, made somewhere in middleware
//   res.send();
//   res.cookie('auth', req.token);

//   /* maybe like this: 
//   res.send({
//     token: req.token,
//     user: req.user,
//   })
//   */
// });

module.exports = router;