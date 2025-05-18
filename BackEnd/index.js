const express = require('express');
const {WebSocketServer} = require('ws');
const cors = require('cors');
const http = require('http')
require('dotenv').config();
const url = require('url')
const authRouter = require('./Routers/auth.Router.js');
const firendReqRouter = require('./Routers/friendReq.Router.js');
const roomManagerRouter = require('./Routers/roomManager.Router.js');
const connections = {};
const users = {};
module.exports = {state: { connections, users} };

const { handleclose, handlemessage } = require('./Sockets/utils.js');
const app = express();
app.use(express.json());

// const corsOption = {
//     origin: process.env.frontendURL,
//     optionSuccessStatus: 200
// }

app.use(cors());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1', firendReqRouter);
app.use('/api/v1/room', roomManagerRouter);

const httpserver = new http.createServer(app);
const websocetserver = new WebSocketServer({ server: httpserver });

websocetserver.on('connection', (connection, request) => {
    const parsedurl = url.parse(request.url, true);
    const {user_id, username} = parsedurl.query;
    connections[user_id] = connection;
    users[user_id] = {
        username,
        isonline: true,
    };
    console.log(user_id, users[user_id]);
    connection.on('message', (message) => handlemessage(message, user_id));
    connection.on('close', () => handleclose(user_id));
});

const port = 8080;

httpserver.listen(port, () => {
    console.log('websocket server started at port:', port);
});

