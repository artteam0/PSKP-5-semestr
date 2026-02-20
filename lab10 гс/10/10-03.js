const WebSocket = require('ws');

const wss = new WebSocket.Server({port:4000, host:'localhost', path:'/broadcast'});

wss.on('connection',(ws)=>{
    ws.on('message',(data)=>{
        console.log("hello");
        wss.clients.forEach((client)=>{
            if(client.readyState === WebSocket.OPEN)
                client.send('server: '+ data);
        });
    });

    ws.on('error',(e)=> console.log('error:',e.message));
});