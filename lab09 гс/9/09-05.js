let http = require('http');
let xmlbuilder = require('xmlbuilder');
let { parseString } = require('xml2js');

const xmldoc = xmlbuilder.create('request')
    .att('id', '28')
        .ele('x').att('value', '1').up()
        .ele('x').att('value', '2').up()
        .ele('m').att('value', 'a').up()
        .ele('m').att('value', 'b').up()
        .ele('m').att('value', 'c').up();

const options = {
    host: 'localhost',
    path: '/',
    port: 3000,
    method: 'POST',
    headers: { 'Content-Type': 'text/xml', 'accept':'text/xml' }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('http.response: end: body =', data);
       
        parseString(data, (err, str) => {
            if (err) {
                console.error('xml parse error');
            } else {
                console.dir(str, {depth:null});
            }
        });
    });
});

req.on('error', (e) => { console.log('http.request: error:', e.message); });

req.end(xmldoc.toString({pretty:true}));