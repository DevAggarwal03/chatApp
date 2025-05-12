const http = require('http');
const {WebSocketServer} = require('ws')
const url = require('url');
const uuidv4 = require('uuid').v4;

const httpServer = new http.createServer();

const webSocetServer = new WebSocketServer({server: httpServer});

const connections = {}
const users = {};

const broadCast = (sendersUuid, uuid, text) => {
    console.log(uuid, text);
    const connection = connections[uuid];
    const payload = {
        from: users[sendersUuid],
        message: text
    }
    console.log(payload);
    connection.send(JSON.stringify(payload));    
}

const handleMessage = (bytes, uuid) => {
    /*
        message = {
            to: <uuid>,
            text: <textToSend> 
        }
    */
    const message = JSON.parse(bytes.toString());
    const personToSend = message.to;
    const textToSend = message.text;
    broadCast(uuid, personToSend,textToSend)
    console.log(message)
}
const handleClose = (uuid) => {
    delete connections[uuid];
    users[uuid].isOnline = false;
    console.log('user Disconnected')
}

webSocetServer.on('connection', (connection, request) => {
    const {username} = url.parse(request.url, true).query;
    const uniqueId = uuidv4();
    connections[uniqueId] = connection;
    users[uniqueId] = {
        username,
        isOnline: true,
    } 
    console.log(uniqueId, users[uniqueId]);
    connection.on('message', (message) => handleMessage(message, uniqueId));
    connection.on('close', () => handleClose(uniqueId) ) 
})

const port = 8080;

httpServer.listen(port, () => {
    console.log('webSocket server started at port: ', port);
})
