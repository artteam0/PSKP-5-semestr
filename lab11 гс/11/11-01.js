var WebSocket = require('ws');
var fs = require('fs');

var wss = new WebSocket.Server({port:4000, host:'localhost'});
let fileDir = '/upload'
let k = 0;

wss.on('connection', (ws)=>{
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf-8'}); //дуплексный канал
    let wfile = fs.createWriteStream(`.${fileDir}/MyFileFromClient${++k}.txt`);
    duplex.pipe(wfile);
});x