'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SINGLE_USE_TOKENS = true;
require('dotenv').config();

const usedTokenSchema = mongoose.Schema({
  token: { type: String, required: true, unique: true },
});
const usedTokenModel = mongoose.model('used tokens', usedTokenSchema);

const users = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  fullname: { type: String },
  role: { type: String, default: 'user', enum: ['admin', 'editor', 'user', 'writer'] },
  capabilities: { type: Array, default: [], required: true },
});

users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  if (this.isModified('role')) {
    switch (this.role) {
    case 'user':
      this.capabilities = ['read'];
      break;
    case 'writer':
      this.capabilities = ['create', 'read'];
      console.log('writer works');
      break;
    case 'editor':
      this.capabilities = ['create', 'read', 'update'];
      break;
    case 'admin':
      this.capabilities = ['create', 'read', 'update', 'delete'];
      break;
    default:
      break;
    }
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

  if (SINGLE_USE_TOKENS) {
    let found = await usedTokenModel.findOne({ token: token });
    if (found) {
      return Promise.reject('Token cannot be used twice');
    }
  }
  try {
    console.log('in try');
    let userToken = await jwt.verify(token, process.env.SECRET);

    if (SINGLE_USE_TOKENS) {
      const addedToken = new usedTokenModel({ token: token });
      addedToken.save();
    }

    let inDb = await this.findById(userToken.id);
    return inDb ? Promise.resolve(inDb) : Promise.reject();

  } catch (e) {
    return Promise.reject('Inavalid Login');
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
  const signed = await jwt.sign({
    id: this._id,
    role: this.role,
    capabilities: this.capabilities,
  }, process.env.SECRET);
  return signed;
};


module.exports = mongoose.model('users', users);

