let http = require('http');
var xml2js = require('xml2js');

let server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let data = '';
        req.on('data', chunk => {
            data += chunk.toString();
        });

        req.on('end', () => {
            let parser = new xml2js.Parser();
            parser.parseString(data, (err, result) => {
                    
            if (err) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('XML parse error');
                return;
            }

            try 
            {
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
                        '$': { id: '1', request: requestId }, 
                        sum: { '$': { element: 'x', result: sum.toString() } },
                        concat: { '$': { element: 'm', result: concatStr } }
                    }
                };
                        
                let builder = new xml2js.Builder();
                let xmlResponse = builder.buildObject(responseObj);
                
                res.writeHead(200, {'Content-Type': 'application/xml; charset=utf-8'});
                res.end(xmlResponse);

                } catch (e) {
                     console.error('Server error:', e); 
                     res.writeHead(400, {'Content-Type': 'application/xml; charset=utf-8'});
                     res.end('Bad Request');
                }
            });
        });
    } else {
        res.writeHead(405);
        res.end('Method Not Allowed');
    }
});

server.listen(3000);

console.log("Server running at http://localhost:3000");