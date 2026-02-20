var http = require('http');

http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end('<h1>Hello World</h1>\n');
}).listen(3000);

console.log('Server running as http://localhost:3000/');

// const http = require('http');

// http.createServer(function(request, response) {

//     const cookies = request.headers.cookie;
//     response.writeHead(200, {'Content-Type': 'text/html'});

//     if (cookies) {
//         response.write('<h5>cookie:</h5><p>' + cookies + '</p>');
//     } else {
//         response.write('<h5>cookie not found.</h5>');
//     }
//     response.end('<h1>Hello World</h1>\n');
// }).listen(3000);

// console.log('Сервер запущен на http://localhost:3000/');