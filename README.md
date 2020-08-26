# auth-server
Week 3
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
echo '{"username":"josh","password":"pass"}' | http post :3000/signup
```
Post a sign in by typing this in the terminal:
```
http POST :3000/signin -a josh:pass
```
See all user:
```
http :3000/users
```