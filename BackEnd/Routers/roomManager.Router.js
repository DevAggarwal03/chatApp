const express = require('express');
const { insertMsg, fetchChats } = require('../controllers/roomsController');
const roomManagerRouter = express.Router();

roomManagerRouter.post('/transmitMessage', insertMsg);
roomManagerRouter.get('/fetchmessages', fetchChats);

module.exports = roomManagerRouter;