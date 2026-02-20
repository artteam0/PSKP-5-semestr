var http = require('http');
var fs = require('fs');
const route ='html';

http.createServer(function(req,res)
{
    if(req.url ==='/'+ route)
    {
        let html = fs.readFileSync('./index.html');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(html);
    }
    else{
        res.end('<h1>Error</h1>');
    }

}).listen(5000);

console.log('Server running at http://localhost:5000');

