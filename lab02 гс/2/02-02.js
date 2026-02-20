var http = require('http');
var fs = require('fs');
const route = 'png';

http.createServer(function(req, res)
{
    if(req.url ==='/'+ route) {
        let png = fs.readFileSync('./pic.png');
        res.writeHead(200, {'Content-Type': 'image/png; charset=utf-8'});
        res.end(png);
    }
    else{
        res.end('<h1>Error</h1>');
    }
}).listen(5000);


console.log('Server running at http://localhost:5000');