const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000'); 

ws.on('open',()=>{
    ws.send('Hello from client!');
});

ws.on('message',(data) => {
    console.log('Received message from server:', data);
    try {
        const notification = JSON.parse(data);
        console.log('Parsed notification:', notification);
    } catch (e) {
        console.error('Could not parse WebSocket message as JSON:', e);
    }
});

ws.on('close', () =>{
    console.log('WebSocket connection closed');
    ws.close();
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});
