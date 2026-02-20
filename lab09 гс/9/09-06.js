var http = require('http');
var fs = require('fs');

const filePath = './MyFile.txt';

const fileContent = fs.readFileSync(filePath, 'utf8');

let boundary = '---------------------';

let body = '';
body += `--${boundary}\r\n`;
body += `Content-Disposition: form-data; name="myFile"; filename="MyFile.txt"\r\n`;
body += `Content-Type: text/plain\r\n`;
body += `\r\n`;
body += fileContent;
body += `\r\n`;
body += `--${boundary}--\r\n`;


const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': Buffer.byteLength(body)
  }
};

const req = http.request(options, (res) => {

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('http.request: data: body:', data);
  });
});

req.on('error', (e) => {
  console.error(`http.request: error: ${e.message}`);
});


req.end(body);