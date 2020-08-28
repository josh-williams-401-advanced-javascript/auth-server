'use strict';

require('dotenv').config();

const { server } = require('../src/server');

const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(server);

it('should allow entry with good token', async () => {
  // Can be convenient to store a TEST_TOKEN in environment
  // But you will have to refresh it (aka grab a new one) if/when it expires
  const results = await mockRequest.post('/signup').send({ username: 'admin', password: 'password', role: 'admin' });
  const response = await mockRequest.get('/secret').auth(results.body.token, {type: 'bearer'});
  expect(response.status).toBe(200);
});

it('should NOT allow entry with bad token', async () => {
  const response = await mockRequest.get('/secret').auth('bad token', {type: 'bearer'});
  expect(response.status).toBe(500);
});