const WebSocket = require('ws');

let parm2 = process.argv[2];
var id = 0;     

let prfx = typeof parm2 == 'undefined'?`${++id}`:parm2;
const ws = new WebSocket('ws://localhost:4000/broadcast');

let intervalId = null;

ws.on('open', ()=>{
    let k = 0;
    intervalId = setInterval(()=>{
        ws.send(`client: ${prfx}-${++k}`);
    },1000);
    ws.on('message', message =>{
        console.log(`Received message => ${message}`);
    })

    setTimeout(()=>{ws.close()},25000);
});

ws.on('close', () => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});