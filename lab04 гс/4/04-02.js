var http = require('http');
var url = require('url');
var fs = require('fs');
var data = require('./db.js');

var db = new data.DB();

db.on('GET', (req, res) => {
    console.log('DB.GET');
    res.end(JSON.stringify(db.get()));
});

db.on('POST', (req, res) => {
    console.log('DB.POST');
    req.on('data', data => {
        let r = JSON.parse(data);
        db.post(r);
        res.end(JSON.stringify(r));
    });
});

db.on('PUT', (req, res) => {
    console.log('DB.PUT');
    req.on('data', data => {
        let r = JSON.parse(data);
        let updated = db.put(r);
        res.end(JSON.stringify(updated));
    });
});

db.on('DELETE', (req, res) => {
    console.log('DB.DELETE');
    let id = url.parse(req.url, true).query.id;
    if(id){
        let deleted = db.delete(id);
        res.end(JSON.stringify(deleted));
    }
    else{
        res.statusCode = 400;
        res.end(JSON.stringify({error: 'Not found ID'}));
    }
});

http.createServer(function (request, response) {
    if(url.parse(request.url).pathname === '/') {
        let html = fs.readFileSync('./04-02.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }
    else if(url.parse(request.url).pathname === '/api/db'){
        db.emit(request.method, request, response);
    }
}).listen(5000);

console.log('Server running at http://localhost:5000');