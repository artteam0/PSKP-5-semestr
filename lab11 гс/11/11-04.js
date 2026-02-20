const WebSocket = require('ws');

const wss = new WebSocket.Server({port:4000, host:'localhost'});

wss.on('connection',(ws)=>{
    
    let n = 0;

    ws.on('message',(data)=>{
        console.log('on message', JSON.parse(data));
        ws.send(JSON.stringify({server: ++n,
                                client: JSON.parse(data).client,
                                timestamp: new Date().toString()
        }))
    });

});