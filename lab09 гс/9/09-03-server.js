var http = require('http');
var querystring = require('querystring');

var server = http.createServer((req, res) => {
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    if (req.method === 'POST') 
    {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString(); 
        });

        req.on('end', () => {
            let params = querystring.parse(body);
            console.log('Parameters:', params);
            res.writeHead(200);
            res.end(`parameters POST: x=${params.x}, y=${params.y}, s=${params.s}`);
        });

    } else {
        res.writeHead(405); 
        res.end('Method Not Allowed');
    }
});


server.listen(3000);

console.log("Server running at http://localhost:3000");