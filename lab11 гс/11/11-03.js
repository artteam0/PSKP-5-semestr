const WebSocket = require('ws');

let n = 0;

const wss = new WebSocket.Server({port: 4000, host: 'localhost'});

wss.on('connection', (ws)=>{
    setInterval(() => {
        wss.clients.forEach((client)=>{
            if (client.readyState === ws.OPEN){
                client.send(`11-03-server: ${++n}`);
            }
        })
    }, 15000);

    ws.on('pong', (data)=>{
        console.log(`On pong: ${data.toString()}`);
    });
    ws.on('message', (data)=>{
        console.log(`On message: ${data.toString()}`);
        ws.send(data);
    });

    setInterval(() => {
        console.log(`Count of connections: ${wss.clients.size} clients`);
        ws.ping(`Server ping: ${wss.clients.size} clients`);
    }, 5000);
});