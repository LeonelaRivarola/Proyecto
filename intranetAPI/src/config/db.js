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
    return sql.connect(createConfig(process.env.SRV_GeaCorpico));
}

async function connectToGeaSeguridad() {
    return sql.connect(createConfig(process.env.SRV_GeaSeguridad));
}

async function connectToAlum() {
    return sql.connect(createConfig(process.env.SRV_ALUM));
}

module.exports = {
    connectToGeaCorpico,
    connectToGeaSeguridad,
    connectToAlum,
    sql
};
