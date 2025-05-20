const { response } = require('express');
const { state } = require('../index')
const { axios } = require('axios')

const broadcast = (senderId, recieverId, text) => {
    console.log(recieverId, text);
    console.log(state.users[recieverId]);
    const connection = state.connections[recieverId];
    const payload = {
        from: state.users[senderId],
        message: text
    };
    
    console.log(payload);
    if (connection) {
        connection.send(JSON.stringify(payload));    
    }
    
    //add to db

    // fetch('http://localhost:8080/api/v1/room/transmitMessage', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         user_id: senderId,
    //         rec_id: recieverId,
    //         username: state.users[senderId].username,
    //         message: text
    //     })
    // }).then(response => console.log(response.success))
    //     .catch(response => console.log(response.error))

};

const handlemessage = (bytes, socket, user_id) => {
    // {
    //     type: 'chat',
    //     payload: {
    //         to: rec_id,
    //         text: "text here"
    //     }
    // }
    const message = JSON.parse(bytes.toString());
    const persontosend = message.payload.to;
    const texttosend = message.payload.text;
    broadcast(user_id, persontosend, texttosend);
    console.log(message);
};

const handleclose = (uuid) => {
    delete state.connections[uuid];
    if (state.users[uuid]) state.users[uuid].isonline = false;
    console.log('user disconnected');
};

module.exports = {handleclose, handlemessage};