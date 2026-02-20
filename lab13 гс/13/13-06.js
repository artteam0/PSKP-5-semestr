const net = require('net');

const HOST = '0.0.0.0';
const PORT = 40000;

const numberX = parseInt(process.argv[2]);

if (isNaN(numberX)) {
    console.log('Invalid number');
    process.exit(1);
}

const client = new net.Socket();
let timerId = null;

client.connect(PORT, HOST, () => {
    console.log('Client CONNECTED: ', client.remoteAddress + ' ' + client.remotePort);

    const buf = Buffer.alloc(4);

    timerId = setInterval(() => {
        client.write((buf.writeInt32LE(numberX, 0), buf));
    }, 1000);
});


client.on('data', (data)=>{console.log('Client DATA: ', data.readInt32LE())});

client.on('close',()=>{console.log('Client CLOSE');});

client.on('error',(e)=>{console.log('Client ERROR: ', e);});