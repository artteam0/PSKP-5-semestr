var http = require('http');
var fs = require('fs');

var httpserver = http.createServer((req, res)=>{
    if(req.method == 'GET' && req.url == '/start')
    {
        res.writeHead(200,{'Content-Type':'text/html; charse=utf-8'});
        res.end(fs.readFileSync('./10-01.html'));
    } else {
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end('400 Bad Request');
    }
});

httpserver.listen(3000);
console.log('http server: 3000');

let k = 0;
let n = 0;

const WebSocket = require('ws');
const wsserver = new WebSocket.Server({port: 4000, host:'localhost', path:'/wsserver'});

wsserver.on('connection', (ws)=>{
    ws.on('message', message=>{
        let match = message.toString().match(/10-01-client: (\d+)/);

        if (match && match[1]) {
            n = parseInt(match[1]);
        }
    });
    let serverInterval = setInterval(() => {
        ws.send(`10-01-server: ${n}->${++k}`);
    }, 5000);

     ws.on('close', () => {
        clearInterval(serverInterval); 
        k = 0;
        n = 0;
    });
})

wsserver.on('error', (e)=>console.log('ws server error', e));
console.log(`ws server: host: ${wsserver.options.host}, port:${wsserver.options.port}, path:${wsserver.options.path}`);