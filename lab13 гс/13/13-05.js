const net = require('net');

const HOST = '0.0.0.0';
const PORT = 40000;

const server = net.createServer();

server.on('connection', (sock) => {

    console.log('Server CONNECTED: ' + sock.remoteAddress + ':'+sock.remotePort);

    let sum = 0; //своя для каждого

    sock.on('data', (data) => {
        console.log('Server DATA: ', data, sum);
        sum += data.readInt32LE();
    });

    const buf = Buffer.alloc(4);
    setInterval(() => {
        buf.writeInt32LE(sum, 0);
        sock.write(buf);
    }, 5000);

    sock.on('close', () => {
        console.log(`Server CLOSED`, sock.remoteAddress + ' ' + sock.remotePort);
    });

    sock.on('error', (e) => {
        console.log(`Server ERROR `, sock.remoteAddress+' '+sock.remotePort);
    });
});

server.on('listening', () => {
    console.log(`TCP-server `, HOST + ':'+ PORT);
});

server.on('error', (e) => {
    console.log(`TCP-server error: `, e);
});

server.listen(PORT, HOST);