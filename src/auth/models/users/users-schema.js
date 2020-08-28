'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const users = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  fullname: { type: String },
  role: { type: String, default: 'user', enum: ['admin', 'editor', 'user'] },
});

users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

users.statics.authenticateBasic = async function (username, password) {
  try {
    let user = await this.findOne({ username });
    let compare = await bcrypt.compare(password, user.password);
    if (user && compare) {
      let signed = await user.generateToken();
      return { token: signed, user };
    } else {
      return Promise.reject();
    }
  } catch (e) {
    return null;
  }
};

users.statics.createFromOauth = async function (oauthUsername) {

  if (!oauthUsername) { return Promise.reject('Validation Error'); }
  let allUsers = await this.find({});
  let isInDbAlready = allUsers.filter(user => user.username === oauthUsername);
  let user;
  if (!isInDbAlready.length) {
    const newUserObj = {
      username: oauthUsername,
      password: 'password',
    };
    user = new this(newUserObj);
    user.save(user);
  } else {
    user = isInDbAlready[0];
  }
  return user;
};

users.statics.authenticateToken = async function (token) {

  try {

    let userToken = await jwt.verify(token, process.env.SECRET);

    let inDb = await this.findById(userToken.id);

    return inDb ? Promise.resolve(inDb) : Promise.reject();

  } catch (e) {
    return Promise.reject();
  }
};

users.statics.findAll = async function () {
  return await this.find({});
};

users.methods.comparePasswords = async function (plainPassword) {
  let isValid = await bcrypt.compare(plainPassword, this.password);
  return isValid ? this : null;
};

users.methods.generateToken = async function () {
  const signed = await jwt.sign({ id: this._id, role: this.role }, process.env.SECRET);
  return signed;
};


module.exports = mongoose.model('users', users);

