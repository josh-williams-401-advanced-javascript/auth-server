'use strict';

process.env.SECRET = 'muysecreto';

const jwt = require('jsonwebtoken');

const server = require('../src/server.js').server;
const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(server);


describe('Auth Router', () => {

  describe(`users signup/in`, () => {

    it('can sign up', async () => {

      const userData = { username: 'admin', password: 'password', role: 'admin', email: 'admin@admin.com' };

      const results = await mockRequest.post('/signup').send(userData);

      expect(results.status).toBe(201);
      expect(results.text).toBe(`Created user admin`);

    });

    it('can signin with basic', async () => {

      const userData = { username: 'joey', password: 'password', role: 'admin', email: 'admin@admin.com' };

      await mockRequest.post('/signup').send(userData);

      const results = await mockRequest.post('/signin').auth('joey', 'password');
      const token = jwt.verify(results.body.token, process.env.SECRET);
      expect(token).toBeDefined();

    });

  });


});
