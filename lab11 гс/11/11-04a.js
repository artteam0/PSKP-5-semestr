const WebSocket = require('ws');

let parm2 = process.argv[2];
let prfx = typeof parm2 == 'undefined'?'A': parm2;

const ws = new WebSocket('ws://localhost:4000');

ws.on('open',()=>{
    ws.on('message',(data=>{
        console.log('on message: ', JSON.parse(data));
    }))

    let k = 0;
    setInterval(()=>{
        ws.send(JSON.stringify({
            client: prfx,
            timestamp: new Date().toISOString()
        }));
    }, 3000);
});