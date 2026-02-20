var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');
var xml2js = require('xml2js');
var multiparty = require('multiparty');

const STATIC_DIR = './static';

let HTTP404 = (req, res)=>{
    console.log(`${req.method}: ${req.url}, HTTP status 404`);
    res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(`{"error"}:"${req.method}: ${req.url}, HTTP status 404"`)
}

let GET_handler = (req, res)=>{
        let parsedUrl = url.parse(req.url, true);
        let pathname = parsedUrl.pathname; 
        let query = parsedUrl.query;   
      
        if (pathname == '/connection') {
          if (query.set) {
            let setValue = parseInt(query.set);

            if (!isNaN(setValue)) {
                server.keepAliveTimeout = setValue;
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.end(`Установлено новое значение параметра KeepAliveTimeout = ${server.keepAliveTimeout}`);
            } else {
                res.writeHead(400, {'Content-Type': 'text/html; charset=utf-8'});
                res.end('Error: value must be a number');
            }
           } 
          else {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write('<h2>KeepAliveTimeout</h2>');
            res.end(`Текущее значение: ${server.keepAliveTimeout}`);
          }
        }
        else if(pathname == '/headers')
        {
            res.setHeader('X-My-Header', 'Hello from server!');

            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

            let responseBody = '<h2>Request Headers:</h2>';
            for (let key in req.headers) {
                responseBody += `${key}: ${req.headers[key]}<br/>`; 
            }

            responseBody += '<h2>Response Headers:</h2>';
            let responseHeaders = res.getHeaders();
            for (let key in responseHeaders) {
                responseBody += `${key}: ${responseHeaders[key]}<br/>`;
            }

            res.end(responseBody);
        }
        else if (pathname == '/parameter') {
    
            let x = parseFloat(query.x);
            let y = parseFloat(query.y);

            if (!isNaN(x) && !isNaN(y)) {
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                let body = `<h1>Calculations for x=${x} and y=${y}</h1>`;
                body += `Sum: ${x + y}<br/>`;
                body += `Difference: ${x - y}<br/>`;
                body += `Product: ${x * y}<br/>`;

                if (y != 0) {
                    body += `Div: ${x / y}<br/>`;
                } else {
                    body += `Div: Division by zero!<br/>`;
                }
                res.end(body);
            }
            else {
                res.writeHead(400, {'Content-Type': 'text/html; charset=utf-8'});
                res.end(`<h1>Error</h1>`);
            }
        }
        else if (pathname.startsWith('/parameter/')) {
            let parms = pathname.split('/');

            if (parms.length >= 4) {
    
                let x = parseFloat(parms[2]);
                let y = parseFloat(parms[3]);

                if (!isNaN(x) && !isNaN(y)) {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    let body = `<h1>Calculations for x=${x} and y=${y} from URI path</h1>`;
                    body += `Sum: ${x + y}<br/>`;
                    body += `Difference: ${x - y}<br/>`;
                    body += `Product: ${x * y}<br/>`;

                    if (y !== 0) {
                        body += `Div: ${x / y}<br/>`;
                    } else {
                        body += `Div: Division by zero!<br/>`;
                    }
                    res.end(body);
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.end(`URI: ${req.url}`);
                }
            } else {
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.end(`URI: ${req.url}`);
            }
        }
        else if (pathname=='/close')
        {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end('<h1>Server will be closed in 10 seconds.</h1>');

            setTimeout(()=>{
                    server.close(()=> console.log('server.close')); 
                    process.exit(0);
                },10000);
        }
        else if(pathname=='/socket')
        {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

            let body = `<h1>Socket Info</h1>`;
            body += `Client IP-address: ${req.socket.remoteAddress}<br/>`;
            body += `Client port: ${req.socket.remotePort}<br/>`;
            body += `Server IP-address: ${req.socket.localAddress}<br/>`;
            body += `Server port: ${req.socket.localPort}<br/>`;

            res.end(body);
        }
        else if(pathname=='/req-data')
        {
            let buf = '';

            req.on('data', (data)=>{
                console.log('request.on(data) chunk size =', data.length);
                buf += data; 
            });
          
            req.on('end', ()=>{
                console.log('request.on(end) total size =', buf.length);
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
   
                res.end(buf); 
            });
        }
        else if (pathname == '/resp-status') {
            const q = parsedUrl.query;
            const code = parseInt(q.c);
            const mess = q.m;
        
            if (!isNaN(code) && mess) {
                res.statusCode = code;
                res.statusMessage = mess;
                res.end(`${res.statusCode}: ${res.statusMessage}`);
            } else {
                res.writeHead(400, {'Content-Type':'text/plain; charset=utf-8'});
                res.end('Invalid status code or message');
            }
        }
        else if (pathname == '/formparameter') {
            fs.readFile('./index.html', (err, data) => {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('error');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.end(data);
                }
            });
        }
        else if (pathname == '/files') {

            fs.readdir(STATIC_DIR, (err, files) => {
                if (err) {
                    console.error('Error reading static directory:', err);
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('error');
                    return;
                }
                
                res.setHeader('X-static-files-count', files.length);
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify({ files_count: files.length, files: files }));
            });
        }
        else if (pathname.startsWith('/files/')) {
            
            let filename = pathname.split('/')[2];
            let filepath = `${STATIC_DIR}/${filename}`;

            if (!fs.existsSync(filepath)) {
                HTTP404(req, res);
                return; 
            }

            let fileStream = fs.createReadStream(filepath);
            fileStream.pipe(res);
        }
        else if (pathname == '/upload') {
            fs.readFile('./upload.html', (err, data) => {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Server error: could not read upload form file.');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.end(data);
                }
            });
        }
        else {
            HTTP404(req, res);
        }

        
}

let POST_handler = (req, res)=>{
        let parsedUrl = url.parse(req.url, true);
        let pathname = parsedUrl.pathname; 
        let query = parsedUrl.query;   

      if (pathname == '/formparameter') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString();});
            req.on('end', () => {
               
                let params = querystring.parse(body);
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

                let responseHtml = '<h1>Полученные параметры формы:</h1>';
                for (let key in params) {
                    let value = Array.isArray(params[key]) ? params[key].join(', ') : params[key];// проверка params массив или нет, если да то выписывает значения в строку через запятую
                    responseHtml += `<p><b>${key}:</b> ${value}</p>`;
                }
                res.end(responseHtml);
            });
        }
        else if (pathname == '/json') {
            let data = '';
            req.on('data', chunk => {
                data += chunk.toString();
            });
            req.on('end', () => {
                try {
                    let requestJson = JSON.parse(data);

                    let sum = requestJson.x + requestJson.y;
                    let concatString = `${requestJson.s}: ${requestJson.o.surname}, ${requestJson.o.name}`;
                    let arrayLength = requestJson.m.length;

                    let responseJson = {
                        "__comment": "Ответ.Лабораторная работа 8/10",
                        "x_plus_y": sum,
                        "Concatenation_s_o": concatString,
                        "Length_m": arrayLength
                    };

                    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify(responseJson));

                } catch (error) {
                    res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify({
                        error: 'Bad Request',
                        message: 'error'
                    }));
                }
            });
        }
        else if (pathname == '/xml') {
            let data = '';
            req.on('data', chunk => {
                data += chunk.toString();
            });
            req.on('end', () => {
                let parser = new xml2js.Parser();
                parser.parseString(data, (err, result) => {
                    
                    if (err) {
                        res.writeHead(400, {'Content-Type': 'application/xml; charset=utf-8'});
                        res.end('error');
                        return;
                    }

                    try {
                        let sum = 0;
                        let concatStr = '';
                        let requestId = result.request.$.id;
                        if (result.request.x) {
                            result.request.x.forEach(el => {
                                sum += parseInt(el.$.value);
                            });
                        }

                        if (result.request.m) {
                            result.request.m.forEach(el => {
                                concatStr += el.$.value;
                            });
                        }

                        let responseObj = {
                            response: {
                                '$': { id: '33', request: requestId }, 
                                sum: { '$': { element: 'x', result: sum.toString() } },
                                concat: { '$': { element: 'm', result: concatStr } }
                            }
                        };
                        
                        let builder = new xml2js.Builder();
                        let xmlResponse = builder.buildObject(responseObj);
                        
                        res.writeHead(200, {'Content-Type': 'application/xml; charset=utf-8'});
                        res.end(xmlResponse);

                    } catch (e) {
                         res.writeHead(400, {'Content-Type': 'application/xml; charset=utf-8'});
                         res.end('error');
                    }
                });
            });
        }
        else if (pathname == '/upload') {
        
            let form = new multiparty.Form({ uploadDir: STATIC_DIR });

            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.error('File upload error:', err);
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Server error during file upload.');
                    return;
                }
                
                let uploadedFile = files.filetoupload[0]; 
                let oldPath = uploadedFile.path;
                let newPath = `${STATIC_DIR}/${uploadedFile.originalFilename}`;

                fs.rename(oldPath, newPath, (renameErr) => {
                    if (renameErr) {
                        console.error('File rename error:', renameErr);
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('Server error: could not save the file with original name.');
                    } else {
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                        res.end(`<h1>Файл успешно загружен!</h1>
                                 <p>Сохранен как: ${uploadedFile.originalFilename}</p>`);
                    }
                });
            });
        }
        else {
            HTTP404(req, res);
        }

}

let http_handler = (req, res) => {
        switch(req.method)
        {
            case 'GET': GET_handler(req,res); break;
            case 'POST': POST_handler(req,res); break;
            default:    HTTP404(req,res);     break;
        }
}

let server = http.createServer();

server.listen(5000, "127.0.0.1", (v)=>{console.log('Server running at http://localhost:5000')})
      .on('error', (e)=> console.log('error', e.code))
      .on('request', http_handler);

