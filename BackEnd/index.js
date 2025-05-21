const express = require('express');
const {WebSocketServer} = require('ws');
const cors = require('cors');
const http = require('http')
require('dotenv').config();
const url = require('url')
const cookieParser = require('cookie-parser');
const authRouter = require('./Routers/auth.Router.js');
const firendReqRouter = require('./Routers/friendReq.Router.js');
const roomManagerRouter = require('./Routers/roomManager.Router.js');
const connections = {};
const users = {};

module.exports = {state: { connections, users} };

const { handleclose, handlemessage } = require('./Sockets/utils.js');
const { checkUser } = require('./middleware/auth.middleware.js');
const app = express();
app.use(express.json());

const originURL = process.env.frontendURL;
console.log(originURL)
app.use(cors({
  origin: originURL, 
  credentials: true               
}));
app.use(cookieParser());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1', checkUser, firendReqRouter);
app.use('/api/v1/room', roomManagerRouter);


const httpserver = new http.createServer(app);
const websocetserver = new WebSocketServer({ server: httpserver });

websocetserver.on('connection', (connection, request) => {
    const parsedurl = url.parse(request.url, true);
    const {username,userId} = parsedurl.query;
    connections[userId] = connection;
    users[userId] = {
        userId,
        username,
        isonline: true,
    };
    connection.on('message', (message) => handlemessage(message, connection, userId));
    connection.on('close', () => handleclose(userId));
});

const port = process.env.port;

httpserver.listen(port, (req, res) => {
    console.log('websocket server started at port:', port);
});

