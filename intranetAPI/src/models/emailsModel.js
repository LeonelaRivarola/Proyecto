const { connectToAlum, sql } = require('../config/db');

exports.getAll = async () => {
    const pool = await connectToAlum();
    const result = await pool.request().query(`
        SELECT EMSO_DESTINO, EMSO_USUARIO, EMSO_FECHA
        FROM EMAIL_SOLICITUD_OBRA
        ORDER BY EMSO_ID DESC
        `
    );

    return result.recordset;
}