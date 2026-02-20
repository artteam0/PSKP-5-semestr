var http = require('http');
var url = require('url');
var fs = require('fs');
var data = require('./db.js');

var db = new data.DB();

let sd_timer = null; 
let sc_timer = null; 
let ss_timer = null;
let statistics = {
    start: null,
    finish: null,
    request: 0,
    commit: 0
};
let isCollectingStats = false;

db.on('GET', (req, res) => {
    if (isCollectingStats) statistics.request++;
    console.log('DB.GET');
    res.end(JSON.stringify(db.get()));
});

db.on('POST', (req, res) => {
    if (isCollectingStats) statistics.request++;
    console.log('DB.POST');
    req.on('data', data => {
        let r = JSON.parse(data);
        db.post(r);
        res.end(JSON.stringify(r));
    });
});

db.on('PUT', (req, res) => {
    if (isCollectingStats) statistics.request++;
    console.log('DB.PUT');
    req.on('data', data => {
        let r = JSON.parse(data);
        let updated = db.put(r);
        res.end(JSON.stringify(updated));
    });
});

db.on('DELETE', (req, res) => {
    if (isCollectingStats) statistics.request++;
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

db.on('COMMIT', () => {
    if (isCollectingStats) statistics.commit++;
});

process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {
    let chunk;
    while((chunk = process.stdin.read()) != null){
        const [command, ...args] = chunk.trim().split(' ');
        const param = parseInt(args[0], 10);

        switch(command) {
            case 'sd':
                if (sd_timer) clearTimeout(sd_timer); 
                if (!isNaN(param)) {
                    console.log(`Сервер будет остановлен через ${param} секунд.`);
                    sd_timer = setTimeout(() => {
                        console.log('Остановка сервера.');
                        server.close();
                        process.exit(0);
                    }, param * 1000);
                } else {
                    console.log('Остановка сервера отменена.');
                }
                break;
            case 'sc':
                if (sc_timer) clearInterval(sc_timer);
                if (!isNaN(param)) {
                    console.log(`Периодическая фиксация каждые ${param} секунд.`);
                    sc_timer = setInterval(() => db.commit(), param * 1000);
                    sc_timer.unref(); 
                } else {
                    console.log('Периодическая фиксация остановлена.');
                }
                break;
            case 'ss':
                if (ss_timer) clearTimeout(ss_timer);
                if (!isNaN(param)) {
                    console.log(`Сбор статистики начат на ${param} секунд.`);
                    isCollectingStats = true;
                    statistics = { start: new Date().toISOString(), finish: null, request: 0, commit: 0 };
                    ss_timer = setTimeout(() => {
                        console.log('Сбор статистики завершен.');
                        isCollectingStats = false;
                        statistics.finish = new Date().toISOString();
                    }, param * 1000);
                    ss_timer.unref(); 
                } else {
                    console.log('Сбор статистики остановлен.');
                    isCollectingStats = false;
                }
                break;
            default:
                console.log('Неизвестная команда');
        }
    }
});

var server = http.createServer(function (request, response) {
    if(url.parse(request.url).pathname === '/') {
        let html = fs.readFileSync('./05-01.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }
    else if(url.parse(request.url).pathname === '/api/db'){
        db.emit(request.method, request, response);
    }
    else if(url.parse(request.url).pathname === '/api/ss' && request.method === 'GET'){
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(statistics));
    }
}).listen(5000);

console.log('Server running at http://localhost:5000');
console.log('Введите команду (sd, sc, ss) и параметр (число секунд):');