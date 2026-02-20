var http = require('http');
var query = require('querystring');

let parms = query.stringify({x:3, y:4, s:'xxx'});

console.log('parms', parms);


let options ={
    host:'localhost',
    path:'/',
    port: 3000,
    method: 'POST'
};

const req = http.request(options, (res)=>
{
    let data = '';
    res.on('data',(chunk)=>{
        console.log('http.request: data: body = ', data+=chunk.toString('utf8'));
    })
    res.on('end',()=> console.log('http.request: end: body = ', data));
});


req.on('error', (e)=>{console.log('http.request : error: ', e.message)});

req.write(parms);

req.end();