require('dotenv').config();
const sql = require('mssql');
const mysql = requite('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect(err => {
    if (err) console.error('Error en la conexión:', err);
    else console.log('Conectado a MySQL');
});