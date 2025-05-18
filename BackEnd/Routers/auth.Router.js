const express = require('express');
const {signupUser, fetchUser} = require('../controllers/authControllers') 

const authRouter = express.Router();

authRouter.get('/fetchUser', fetchUser);
authRouter.post('/signup', signupUser);

module.exports = authRouter