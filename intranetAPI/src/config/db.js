require('dotenv').config();
const sql = require('mssql');

const createConfig = (database) => ({
    user: process.env.SRV_USERNAME,
    password: process.env.SRV_PASSWORD,
    server: process.env.SRV_HOST,
    database: database,
    options: {
        encrypt: process.env.SRV_ENCRYPT === 'yes',
        trustServerCertificate: true
    }
});

console.log('Host:', process.env.SRV_HOST);
console.log('Base Alum:', process.env.SRV_ALUM);

async function connectToGeaCorpico() {
    const pool = new sql.ConnectionPool(createConfig(process.env.SRV_GeaCorpico));
    return pool.connect();
}

async function connectToGeaSeguridad() {
    const pool = new sql.ConnectionPool(createConfig(process.env.SRV_GeaSeguridad));
    return pool.connect();
}

async function connectToAlum() {
    const pool = new sql.ConnectionPool(createConfig(process.env.SRV_ALUM));
    return pool.connect();
}

module.exports = {
    connectToGeaCorpico,
    connectToGeaSeguridad,
    connectToAlum,
    sql
};
