const { connectToAlum, sql } = require('../config/db');

exports.getAll = async () => {
    const pool = await connectToAlum();
    const result = await pool.request().query(`
        SELECT SOE_ID, SOE_NOMBRE, SOE_APELLIDO, SPR_USUARIO, SPR_PRESUPUESTO_ID
        FROM SOLICITUD_OBRA_ELECTRICA soe
        INNER JOIN SOLICITUD_PRESUPUESTO spr
        ON soe.SOE_USUARIO = spr.SPR_USUARIO;
        `
    );
    return result.recordset;
}

exports.getPresupuestoPath = async (usuario) => {
    const pool = await connectToAlum();
    const result = await pool.request()
        .input('usuario', sql.VarChar, usuario)
        .query(`SELECT PSO_PATH FROM PRESUPUESTO_SOLICITUD_OBRA WHERE PSO_USU_NOTIFICA = @usuario`);
    return result.recordset[0];
};

