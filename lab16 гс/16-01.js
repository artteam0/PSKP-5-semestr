const http = require('http');
const fs = require('fs');
const { graphql } = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema'); 

const { initPools } = require('./config');
const { resolver } = require('./db');

const typeDefs = fs.readFileSync('./BSTU.gql').toString();


const schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolver
});

const PORT = 4000;

const server = http.createServer(async (req, res) => {
    if (req.url === '/graphql' && req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            res.setHeader('Content-Type', 'application/json');
            
            try {
                const parsedBody = JSON.parse(body);
                
                const result = await graphql({
                    schema: schema,            
                    source: parsedBody.query,
                    variableValues: parsedBody.variables,
                });
                           
                res.writeHead(200);
                res.end(JSON.stringify(result));

            } catch (error) {
                console.error('Request Error:', error);
                res.writeHead(400);
                res.end(JSON.stringify({ 
                    errors: [{ message: 'Invalid JSON or Request: ' + error.message }] 
                }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('GraphQL API работает по адресу /graphql (метод POST)');
    }
});

initPools()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}/graphql`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to DB:', err);
        process.exit(1);
    });