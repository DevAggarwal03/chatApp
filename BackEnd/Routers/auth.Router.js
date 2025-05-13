const express = require('express');
const {signupUser} = require('../controllers/authControllers') 

const authRouter = express.Router();

authRouter.post('/signup', signupUser);

module.exports = authRouter