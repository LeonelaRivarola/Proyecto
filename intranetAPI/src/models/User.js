const { connectToGeaSeguridad, sql } = require('../config/db');


async function findUserByUsername(username) {
    const pool = await connectToGeaSeguridad();
    const result = await pool
        .request()
        .input('username', sql.VarChar, username)
        .query('SELECT USU_CODIGO, USU_NOMBRE, USU_PASSWORD FROM USUARIOS WHERE USU_CODIGO = @username');
    
    return result.recordset[0];
}

module.exports = { findUserByUsername };
