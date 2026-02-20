const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000');

ws.on('message', (message) => {
    console.log('on message: ', message.toString());
});

ws.on('ping', (data) => {
    console.log('on ping: ', data.toString());
    ws.pong('Client PONG'); 
});
