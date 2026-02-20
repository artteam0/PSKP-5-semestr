var WebSocket = require('ws');
var fs = require('fs');

var wss = new WebSocket.Server({port:4000, host:'localhost'});

let fileDir = '/download'

wss.on('connection', (ws)=>{
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf-8'});
    let rfile = fs.createReadStream(`.${fileDir}/MyDownloadFile.txt`);
    rfile.pipe(duplex);
});