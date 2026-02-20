var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

const STATIC_DIR = './static';

var server = http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;

    const filePath = path.join(STATIC_DIR, pathname);

    if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
    }

    res.writeHead(200, {
        'Content-Type': 'application/octet-stream', 
        'Content-Disposition': `attachment; filename="${path.basename(filePath)}"` 
    });

    let readStream = fs.createReadStream(filePath); 

    readStream.pipe(res); //чтение из файла и запись в response

    readStream.on('error', (err) => {
        res.statusCode = 500;
        res.end('Server Error');
    });
});

server.listen(3000, () => {
    console.log(`Сервер запущен на http://localhost:3000`);
  
});