const { connectToGeaCorpico, sql } = require('../config/db');

exports.getAll = async () => {
const pool = await connectToGeaCorpico();
const result = await pool.request().query(`
    SELECT SPO_ID, SPO_APELLIDO, SPO_NOMBRE, SPO_SOLICITUD
    FROM SOLICITUD_PRESUPUESTO_OBRA
    ORDER BY SPO_ID DESC
 `
);
return result.recordset;
}