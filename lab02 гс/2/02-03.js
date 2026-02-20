var http = require('http');
const route ='api/name'

http.createServer(function (request, response) {
    if(request.url==='/'+ route)
    {
    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    response.end('Кулешов Артём Алексеевич');
    }
    else{ 
           response.end('<h1>Error</h1>');
    }
}).listen(5000);

console.log('Server running at http://localhost:5000');
