const { connectToGeaCorpico, sql } = require('../config/db');

exports.getAll = async () => {
const pool = await connectToAlum();
const result = await pool.request().query(`
    SELECT SPO_APELLIDO, SPO_NOMBRE, SPO_SOLICITUD
    FROM SOLICITUD_PRESUPUESTO_OBRA
    ORDER BY SPO_ID DESC
 `
);
return result.recordset;
}