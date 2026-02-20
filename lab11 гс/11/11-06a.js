const rpcWSC = require('rpc-websockets').Client;

let ws = new rpcWSC('ws://localhost:4000');

ws.on('open', () => {
    ws.subscribe('A');

    ws.on('A', data => {console.log('on A event: ', data.toString())});
});