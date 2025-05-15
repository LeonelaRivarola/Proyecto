require('dotenv').config();
const sql = require('mssql');

// //connection
// const mysqlPool = mysql.createPool({
//     host: process.env.DB_HOST,
// })

const config = {
    user: process.env.SRV_USERNAME,
    password: process.env.SRV_PASSWORD,
    server: process.env.SRV_HOST,
    port: parseInt(process.env.SRV_PORT),
    database: process.env.SRV_DATABASE,
    options: {
        encrypt: process.env.SRV_ENCRYPT == 'yes' ? true : false,
        trustServerCertificate: true,
    },
};

const pool = new sql.ConnectionPool(config);

const conncectToDb = async () =>  {
    try{
        await pool.connect();
        console.log("Conectado a SQL Server");
        return pool;
    } catch (err){
        console.error("Error de conexion: " ,err);
        throw err;
    }
}

module.exports= { conncectToDb, sql};