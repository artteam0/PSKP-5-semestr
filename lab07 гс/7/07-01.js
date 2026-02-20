const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const stat = require('./m07-01')('./static');

http.createServer(function(req, resp){
    const parsedURL = url.parse(req.url, true);
    const pathName =  parsedURL.pathname;

    if (req.method !== 'GET') {
        resp.statusCode = 405;
        resp.statusMessage = 'Method not supported';
        resp.end("Method not supported");
        return;
    }

    if (pathName == '/') {
        fs.readFile(path.join(__dirname, './static/index.html'), (err, html)=>{
            if(err){
                resp.writeHead(500, 'Error', {'Content-Type':'text/html; charset=utf-8'})
                resp.end('Server error');   
            }
            else{
                resp.writeHead(200, 'OK', {'Content-Type': 'text/html'});
                resp.end(html);
            }
        });
        return;
    }
    
    if(stat.isStatic('css', req.url)) stat.sendFile(req, resp, {'Content-Type':'text/css'});
    else if(stat.isStatic('html', req.url)) stat.sendFile(req, resp, {'Content-Type': 'text/html; charset=utf-8'});
    else if(stat.isStatic('js', req.url)) stat.sendFile(req, resp, {'Content-Type':'text/javascript; charset=utf-8'});
    else if(stat.isStatic('json', req.url)) stat.sendFile(req, resp, {'Content-Type':'application/json; charset=utf-8'});
    else if(stat.isStatic('xml', req.url)) stat.sendFile(req, resp, {'Content-Type':'application/xml; charset=utf-8'});
    else if(stat.isStatic('mp4', req.url)) stat.sendFile(req, resp, {'Content-Type':'video/mp4; charset=utf-8'});
    else if(stat.isStatic('docx', req.url)) stat.sendFile(req, resp, {'Content-Type':'application/msword'});
    else if(stat.isStatic('png', req.url))  stat.sendFile(req, resp, {'Content-Type':'image/png'});
    else stat.writeHTTP404(resp);

}).listen(5000);

console.log('Server running at http://localhost:5000');