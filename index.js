'use strict';

const server = require('./src/server');
const mongoose = require('mongoose');

const MONGODB_URI = `mongodb://localhost:${process.env.MONGO_PORT}/auth`;

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(MONGODB_URI, mongooseOptions);

server.start();
