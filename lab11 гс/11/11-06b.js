const rpcWSC = require('rpc-websockets').Client;

let ws = new rpcWSC('ws://localhost:4000');

ws.on('open', () => {
    ws.subscribe('B');

    ws.on('B', data => {console.log('on B event: ', data.toString())});
});