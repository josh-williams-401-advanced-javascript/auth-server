# auth-server
Week 3

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