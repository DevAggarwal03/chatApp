exports.connections = {};
exports.users = {};

const broadcast = (sendersuuid, uuid, text) => {
    console.log(uuid, text);
    const connection = connections[uuid];
    const payload = {
        from: users[sendersuuid],
        message: text
    };
    console.log(payload);
    if (connection) {
        connection.send(json.stringify(payload));    
    }
};

const handlemessage = (bytes, uuid) => {
    const message = json.parse(bytes.tostring());
    const persontosend = message.to;
    const texttosend = message.text;
    broadcast(uuid, persontosend, texttosend);
    console.log(message);
};

const handleclose = (uuid) => {
    delete connections[uuid];
    if (users[uuid]) users[uuid].isonline = false;
    console.log('user disconnected');
};

module.exports = {handleclose, handlemessage};