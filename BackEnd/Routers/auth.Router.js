const express = require('express');
const {signupUser, fetchUser, signinUser} = require('../controllers/authControllers'); 
const { checkUser } = require('../middleware/auth.middleware');

const authRouter = express.Router();

authRouter.get('/fetchUser', checkUser, fetchUser);
// authRouter.get('/getFriendsInfo', checkUser, fetchFriends);
authRouter.post('/signup', signupUser);
authRouter.post('/signin', signinUser);

module.exports = authRouter