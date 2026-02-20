const { Console } = require('console');
var http = require('http');

var server = http.createServer((req,res)=>{
    if(req.method=='GET')
    {
        res.writeHead(200,{'content-type':'text/plain; charset=utf-8'});
        res.end('HELLO WORLD!!');
    }
    else{
        res.writeHead(405, 'Method No Allowed');    
        res.end();
    }

}).listen(3000, 'localhost');

console.log("Server running at http://localhost:3000");