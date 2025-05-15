require('dotenv').config();
const sql = require('mssql');

// Configuración correcta para SQL Server
const config = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST, // 👈 Este es el valor correcto, no `host`
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,               // O `true` si usás SSL
        trustServerCertificate: true  // Necesario si es un server local
    }
};

// Función para conectar
async function connectToDb() {
    try {
        const pool = await sql.connect(config);
        console.log('🔵 Conectado a SQL Server');
        return pool;
    } catch (err) {
        console.error('Error conectando a SQL Server:', err);
        throw err;
    }
}

// Exportá la función correctamente
module.exports = { connectToDb, sql };
