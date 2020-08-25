'use strict';

require('@code-fellows/supergoose');
const auth = require('../src/auth/middleware.js');
const Users = require('../src/auth/models/users/users-schema');

beforeAll(async (done) => {
  await new Users({username: 'admin', password: 'password', role: 'admin', email:'admin@admin.com'}).save();
  done();
});

describe('Auth Middleware', () => {

  // let errorObject = {'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized'};

  describe('user authentication', () => {

    // let cachedToken; // in case you want to test reuse of token

    it('fails a login for a user (admin) with the incorrect basic credentials', async () => {

      let req = {
        headers: {
          authorization: 'Basic YWRtaW46Zm9v',
        },
      };

      let res = {};
      let next = jest.fn();

      await auth(req, res, next);

      expect(next).toHaveBeenCalledWith('Invalid Login');

    });

    it('logs in an admin user with the right credentials', async () => {

      let req = {
        headers: {
          authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
        },
      };
      let res = {};
      let next = jest.fn();

      await auth(req,res,next);

      // cachedToken = req.token;

      expect(next).toHaveBeenCalledWith();

    });

  });

});
