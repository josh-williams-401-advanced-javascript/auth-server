'use strict';

require('dotenv').config();
const supergoose = require('@code-fellows/supergoose');
const { server } = require('../src/server');
const auth = require('../src/auth/middleware/bearer-auth.js');
const mockRequest = supergoose(server);

it('should fail with missing headers', async () => {
  let req = {
    headers: {
      authorization: '',
    },
  };

  let res = {};

  let next = jest.fn();

  await auth(req, res, next);

  expect(next).toHaveBeenCalledWith('Invalid Login: Missing Headers');
});

it('should fail with bad token', async () => {
  let req = {
    headers: {
      authorization: 'Bearer bad.token.surely',
    },
  };

  let res = {};

  let next = jest.fn();

  await auth(req, res, next);

  expect(next).toHaveBeenCalledWith('Invalid Login');
});

it('should carry on with good token', async () => {

  // Can be convenient to store a TEST_TOKEN in environment
  // But you will have to refresh it (aka grab a new one) if/when it expires
  const results = await mockRequest.post('/signup').send({ username: 'admin', password: 'password', role: 'admin' });
  let req = {
    headers: {
      // authorization: `Bearer ${process.env.TEST_TOKEN}`,
      authorization: `Bearer ${results.body.token}`,
    },
  };

  let res = {};

  let next = jest.fn();

  await auth(req, res, next);

  expect(next).toHaveBeenCalledWith();

});