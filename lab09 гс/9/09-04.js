var http = require('http');

let jsonm = JSON.stringify({
    "__comment": "Запрос",
    "x": 1,
    "y": 2,
    "s": "Сообщение",
    "m": ["a", "b", "c", "d"],
    "o": { "surname": "Иванов", "name": "Иван" }
});

let options ={
    host:'localhost',
    path:'/',
    port: 3000,
    method: 'POST',
    headers:{
        'Content-Type':'application/json', 'accept':'application/json'
    }
};

const req = http.request(options, (res)=>
{
    let data = '';
    res.on('data',(chunk)=>{
        console.log('http.request: data: body = ', data+=chunk.toString('utf8'));
    })
    res.on('end',()=> {
        console.log('http.request: end: body = ', data)
        console.log('http.request: end: parse(body) = ', JSON.parse(data));
    });
});


req.on('error', (e)=>{console.log('http.request : error: ', e.message)});

req.end(jsonm);