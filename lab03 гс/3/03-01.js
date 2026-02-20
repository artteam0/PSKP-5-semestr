var http = require('http');
global.state = 'test';
global.oldState = 'test';

http.createServer(function(request, responce){
    responce.writeHead(200, {'content-type': 'text/html;charset=utf-8'});
    responce.end('<h1>' + state + '</h1>');
}).listen(5000);

console.log('Server running at http://localhost:5000');

var stdin = process.openStdin();
stdin.addListener('data', (cmd) => {
    var arg = cmd.toString().trim();
    if(arg === 'norm' || arg === 'test' || arg === 'stop' || arg === 'idle')
    {
        oldState = state;
        state = arg;
        process.stdout.write(oldState + ' --> ' + state + '\n');
    }
    else if (cmd.toString().trim() === 'exit')
        process.exit(0);
    else
        process.stdout.write('Enter one of the commands: norm, stop, test, idle or exit\n');
})