# auth-server
Week 3

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