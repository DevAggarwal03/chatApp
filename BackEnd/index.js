const express = require('express');
const {WebSocketServer} = require('ws');
const http = require('http')
const {Client} = require('pg')
require('dotenv').config();
const authRouter = require('./Routers/auth.Router.js');

const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRouter);

const httpserver = new http.createServer(app);
const websocetserver = new WebSocketServer({ server: httpserver });

const port = 8080;
httpserver.listen(port, () => {
    console.log('websocket server started at port:', port);
});

module.exports = {websocetserver}