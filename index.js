'use strict';

require('dotenv').config();

const MONGODB_URI = `mongodb://localhost:${process.env.MONGO_PORT}/auth`;

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

require('mongoose').connect(MONGODB_URI, mongooseOptions);

require('./src/server').start();
