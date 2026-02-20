var http = require('http');
var fs = require('fs');
var url = require('url');
var multiparty = require('multiparty');

const STATIC_DIR = './static';

var server = http.createServer((req, res) => {
    let parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    if (pathname === '/' && req.method === 'POST') {
        
        let form = new multiparty.Form({ uploadDir: STATIC_DIR });

        form.parse(req, (err, fields, files) => {
            if (err || !files.myFile) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Server error');
                return;
            }
          
            let uploadedFile = files.myFile[0]; 

            let oldPath = uploadedFile.path;
            let newPath = `${STATIC_DIR}/${uploadedFile.originalFilename}`; //хранит хэшированное название файла (путь)

            fs.rename(oldPath, newPath, (renameErr) => {
                if (renameErr) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Server error');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.end(`<h1>Файл ${uploadedFile.originalFilename} успешно загружен!</h1>`);
                }
            });
        });

    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log(`Server running at http://localhost:3000`);
});