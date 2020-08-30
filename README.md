# auth-server
Week 3

### 8/27/2020
All routes are now working, and can be tested with different authorizations:  

- `/public` - All can access
- `/private` - Need a valid token to access
- `/readonly` - Need a role of admin, editor, user, or writer
- `/create` - Need a role of admin, editor, or writer
- `/update` - Need a role of admin or editor
- `/delete` - Need a role of admin  

The app now will only allow a token to be used one time. Whe you first get a token, it will expire after 15 minutes.
If you want to change that for testing, change these settings in `src/auth/users-schema.js`:
```js
const SINGLE_USE_TOKENS = process.env.SINGLE_USE_TOKENS || true;

const TIMED_TOKENS = process.env.TIMED_TOKENS || true;

const MINUTES = 15;

const defaultRole = 'user'; // Change this to test different users
```

### 8/26/2020
```
http post :3000/secret “Authorization:Bearer TOKENSTRING”
```
Bearer Auth is working now. For best results with testing use: https://javascript-401.netlify.app/bearer-auth

Error handlers are updated. All tests are passing.

### 8/25/2020
Now the Oauth assigns new users based on email, so it will make unique users, and it is passing all tests.

### 8/24/2020
Test the Oauth by going to localhost:3000 and clicking login. Signing into github will add you to the database.  

Set up .env like this: 
```
PORT=
MONGO_PORT=
SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### 8/23/2020
Post a sign up by typing this in the terminal:
```
echo '{"username":"dan","password":"wilson"}' | http post :3000/signup
```
Post a sign in by typing this in the terminal:
```
http POST :3000/signin -a josh:pass
```
See all user:
```
http :3000/users
```