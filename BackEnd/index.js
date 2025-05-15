const express = require('express');
const {WebSocketServer} = require('ws');
const http = require('http')
require('dotenv').config();
const { handleclose, handlemessage } = require('./Sockets/utils.js');
const url = require('url')
const uuidv4 = require('uuid').v4;
const { connections, users } = require('./Sockets/utils.js');
const authRouter = require('./Routers/auth.Router.js');
const firendReqRouter = require('./Routers/friendReq.Router.js');
const roomManagerRouter = require('./Routers/roomManager.Router.js');


const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1', firendReqRouter);
app.use('/api/v1/room', roomManagerRouter);

const httpserver = new http.createServer(app);
const websocetserver = new WebSocketServer({ server: httpserver });

websocetserver.on('connection', (connection, request) => {
    const parsedurl = url.parse(request.url, true);
    const {id, username} = parsedurl.query;

    const uniqueid = uuidv4();
    connections[uniqueid] = connection;
    users[uniqueid] = {
        username,
        isonline: true,
    };
    console.log(uniqueid, users[uniqueid]);
    connection.on('message', (message) => handlemessage(message, uniqueid));
    connection.on('close', () => handleclose(uniqueid));
});

const port = 8080;

httpserver.listen(port, () => {
    console.log('websocket server started at port:', port);
});
