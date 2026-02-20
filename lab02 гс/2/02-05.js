var http = require('http');
var fs = require('fs');
const route = 'fetch';

http.createServer((request, response) => {
    const httpFileName = './fetch.html';
    if (request.url === '/api/name')
    {
        response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        response.end('Кулешов Артём Алексеевич')
    }
    else if (request.url === '/' + route)
    {
        fs.readFile(httpFileName, (error, data) => {
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            error != null ? console.log("error:" + error) : response.end(data);
        });
    }
    else 
        response.end('<h1>Error</h1>');
}).listen(5000);
 console.log('Server running at http://localhost:5000');
