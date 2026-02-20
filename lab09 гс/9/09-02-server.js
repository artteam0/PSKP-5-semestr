var http = require('http');
var url = require('url'); 

var server = http.createServer((req, res) => {
    
    let parsedUrl = url.parse(req.url, true);

     res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    if (parsedUrl.pathname === '/') {
        
        let numX = parseFloat(parsedUrl.query.x);
        let numY = parseFloat(parsedUrl.query.y);

        if (isNaN(numX) || isNaN(numY)) {
            
        res.writeHead(400);
        res.end('Ошибка: Параметры x и y должны быть числами');

        } else {
            let sum = numX + numY;
            res.writeHead(200);
            res.end(`Результат: ${numX} + ${numY} = ${sum}`);
        }
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(3000);

console.log("Server running at http://localhost:3000");