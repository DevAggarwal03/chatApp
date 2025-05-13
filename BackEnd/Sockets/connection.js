const {websocetserver} = require('../index'); 
const { handleclose, handlemessage } = require('./utils');
const url = require('url')
const uuidv4 = require('uuid').v4;

websocetserver.on('connection', (connection, request) => {
    const parsedurl = url.parse(request.url, true);
    const username = parsedurl.query.username;

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