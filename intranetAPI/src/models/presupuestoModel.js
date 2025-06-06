const { connectToAlum, sql } = require('../config/db');

exports.getAll = async () => {
    const pool = await connectToAlum();
    const result = await pool.request().query(`
        SELECT SOE_ID, SOE_NOMBRE, SOE_APELLIDO, SPR_PRESUPUESTO_ID
        FROM SOLICITUD_OBRA_ELECTRICA soe
        INNER JOIN SOLICITUD_PRESUPUESTO spr
        ON soe.SOE_USUARIO = spr.SPR_USUARIO;
        `
    );
    return result.recordset;
}