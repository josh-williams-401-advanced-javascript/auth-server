'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const users = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String},
  fullname: {type: String},
  role: {type: String, default: 'user', enum: ['admin', 'editor', 'user'] },
});

users.pre('save', async function () {
  if(this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

users.statics.authenticateBasic = function(username, password) {
  let query = { username };
  return this.findOne(query)
    .then(user => {
      if (user && user.comparePasswords(password)) {
        let signed = user.generateToken();
        return {token: signed, user: user};
      }
    })
    .catch(console.error);
};

users.statics.findAll = async function() {
  return await this.find({});
};

users.methods.comparePasswords = async function(plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

users.methods.generateToken =  function () {
  const signed = jwt.sign({id: this._id}, process.env.SECRET);
  return signed;
};

module.exports = mongoose.model('users', users);

