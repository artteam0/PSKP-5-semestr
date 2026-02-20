var http = require('http');
var fs = require('fs');

const filePath = './MyFile.png'; 

var stats = fs.statSync(filePath);
var fileSizeInBytes = stats.size;

let boundary = '-------------';

let header = `--${boundary}\r\n` +
             `Content-Disposition: form-data; name="myFile"; filename="MyFile.png"\r\n` +
             `Content-Type: application/octet-stream\r\n\r\n`;

let footer = `\r\n--${boundary}--\r\n`;

let totalLength = Buffer.byteLength(header) + fileSizeInBytes + Buffer.byteLength(footer);

const options = {
    hostname: 'localhost',
    port: 3000,     
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': totalLength 
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => console.log('http.request: end: body', data));
});

req.on('error', (e) => console.log(`http.request: error: ${e.message}`));

req.write(header);

let stream = fs.createReadStream(filePath);
stream.on('data', (chunk) => {
    req.write(chunk);
});
stream.on('end', () => {
    req.end(footer);
});