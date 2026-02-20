var http = require('http');
var fs = require('fs');
var url = require('url');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, 
    secure: true, 
    auth: {
        user: 'artemych44@gmail.com', 
        pass: 'wnrbxghwffshgled'
    }
});

let http_handler = (req, resp) => {
    if (url.parse(req.url).pathname == '/' && req.method == 'GET') {
        resp.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        resp.end(fs.readFileSync('./form.html'));
    }
    else if (url.parse(req.url).pathname == '/' && req.method == 'POST') {
        let body = '';
        req.on('data', chunk => {body += chunk.toString();});
        req.on('end', () => {
            let parm = JSON.parse(body);
            console.log(parm);
            transporter.sendMail({
                from: parm.from,
                to: parm.to,
                subject: 'test sendmail',
                html: `<h1>${parm.message}</h1>`
            }, (err, reply) => {
                if (err) {
                    console.log(err && err.stack);
                    console.dir(reply);
                }
                else {
                    resp.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                    resp.end('message send');
                }
            });
        })
    }
    else
        resp.end('<h1>Not support</h1>');
}

let server = http.createServer(http_handler);
server.listen(5000);
console.log('Server running at http://localhost:5000/');