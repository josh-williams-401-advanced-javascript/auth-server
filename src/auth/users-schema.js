'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SINGLE_USE_TOKENS = process.env.SINGLE_USE_TOKENS || false;
const TIMED_TOKENS = process.env.TIMED_TOKENS || false;
const MINUTES = 15;

const defaultRole = 'user';

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
    const roleMap = { user: 1, writer: 2, editor: 3, admin: 4 };
    const capabilities = ['read', 'create', 'update', 'delete'];
    const allowedForThisUser = [];
    for (let i = 0; i < roleMap[this.role]; i++) {
      allowedForThisUser.push(capabilities[i]);
    }
    this.capabilities = allowedForThisUser;
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
      role: defaultRole,
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
    let userToken = await jwt.verify(token, process.env.SECRET);

    if (TIMED_TOKENS) {
      if (Date.now() / 1000 - userToken.iat > 60 * MINUTES) {
        return Promise.reject('Token expired');
      }
    }
    if (SINGLE_USE_TOKENS) {
      const addedToken = new usedTokenModel({ token: token });
      addedToken.save();
    }

    let inDb = await this.findById(userToken.id);
    return inDb ? Promise.resolve(inDb) : Promise.reject();

  } catch (e) {
    return Promise.reject('Invalid Login');
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

