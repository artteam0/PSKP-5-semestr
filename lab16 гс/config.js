const sql = require('mssql');


const config = {
    user: 'test1',
    password: '1111',
    server: 'LENOVO-PC63',
    database: 'KAA',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};

let pool;

async function initPools() {
    try {
        pool = await sql.connect(config);
        console.log('Connected to MSSQL via Windows Authentication');
    } catch (err) {
        console.error('Connection failed:', err);
        throw err;
    }
}

function getPool() {
    return pool;
}

module.exports = {
    initPools,
    getPool,
    sql
};
