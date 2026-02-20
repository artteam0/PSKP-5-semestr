var http = require('http');
var url = require('url');
var fs = require('fs');

let fact = (n) => {
    if (n < 0)
        return "Uncorrect value!";
    else if (n == 0 || n == 1)
        return 1;
    else 
        return n * fact(n-1);
}

http.createServer(function (request, responce) {
    let rc = JSON.stringify({ k: 0 });
    if(url.parse(request.url).pathname === '/fact') {
        console.log(request.url);
        if (typeof url.parse(request.url, true).query.k != 'undefined'){
            let k = parseInt(url.parse(request.url, true).query.k);
            if(Number.isInteger(k)) {
                responce.writeHead(200, {'content-type': 'application/json; charset=utf-8'});
                responce.end(JSON.stringify({ k:k, fact: fact(k) }));
            }
        }
    }
    else{
        responce.end(rc);
    }
}).listen(5000);

console.log('Server running at http://localhost:5000');