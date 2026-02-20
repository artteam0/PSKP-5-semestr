const { Socket } = require('dgram');
const net = require('net');

const HOST = '127.0.0.1';
const PORT = process.argv[2]?process.argv[2]:40000;

let client = new net.Socket();

client.connect(PORT, HOST, ()=>{
    console.log('CLIENT CONNECTED:', client.remoteAddress + ' ' + client.remotePort);
    let X = 0;
    let buf = Buffer.alloc(4);
    setInterval(()=>{client.write((buf.writeInt32LE(X++,0),buf))},
    1000);
})


client.on('data', (data)=>{console.log('Client DATA: ', data.toString())});

client.on('close',()=>{console.log('Client CLOSE');});

client.on('error',(e)=>{console.log('Client ERROR: ', e);});