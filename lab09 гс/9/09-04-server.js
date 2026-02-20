var http = require('http');

var server = http.createServer((req, res) => {
    
    if (req.url === '/' && req.method === 'POST') 
    {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try
            {
                let requestData = JSON.parse(body);

                let sum = requestData.x + requestData.y;
                let concatenation = `${requestData.s}: ${requestData.o.surname}, ${requestData.o.name}`;
                let arrayLength = requestData.m.length;

                const responseData = {
                    "__comment": "Ответ",
                    "x_plus_y": sum,
                    "Concatinat_s_o": concatenation, 
                    "Length_m": arrayLength
                };
                
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(responseData));

            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Bad Request');
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
    }
});

server.listen(3000);

console.log("Server running at http://localhost:3000");