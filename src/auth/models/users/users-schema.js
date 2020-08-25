'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    .then(user => user && user.comparePasswords(password))
    .catch(console.error);
};

// Takes in the plain password from the user request, and compares it to the encrypted password
users.methods.comparePasswords = async function(plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};


users.methods.generateToken = function () {

  // grab token from jwt
};


module.exports = mongoose.model('users', users);

