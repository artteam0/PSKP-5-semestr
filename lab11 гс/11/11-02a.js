var fs = require('fs');
var WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000');

ws.on('open',()=>{
    const duplex = WebSocket.createWebSocketStream(ws,{encoding:'utf-8'});
    let wfile = fs.createWriteStream(`./MyFileFromServer.txt`);
    duplex.pipe(wfile);
})