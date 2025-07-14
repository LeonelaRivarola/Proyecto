const { request } = require('express');
const { connectToAlum, sql } = require('../../config/db');

exports.getAll = async (estadoId) => { //obtiene la solicitud
    const pool = await connectToAlum();

    const request = pool.request();

    let whereEstado = '';
    if (estadoId) {
        request.input('estadoId', sql.Int, estadoId);
        whereEstado = `
            AND SES.SES_ESTADO_ID = @estadoId
        `;
    }
    
    const result = await request.query(`
        SELECT 
            SOE.SOE_ID as Número,
            SOE.SOE_FECHA AS Fecha_Solicitud,
            ESO.ESO_DESCRIPCION AS Estado,
            SES.SES_FECHA AS Fecha_Estado,
            SOE.SOE_USUARIO AS Usuario,
            TOE.TOE_DESCRIPCION AS Tipo,
            SOE.SOE_CUIT AS DNI_CUIT,
            SOE.SOE_APELLIDO AS Apellido, 
            SOE.SOE_NOMBRE AS Nombre
        FROM SOLICITUD_OBRA_ELECTRICA AS SOE
        INNER JOIN TIPO_OBRA_ELECTRICA AS TOE ON SOE.SOE_TIPO_ID = TOE.TOE_ID
        INNER JOIN SOLICITUD_ESTADO AS SES ON SES.SES_SOLICITUD_ID = SOE.SOE_ID
        INNER JOIN ESTADO_SOLICITUD_OBRA AS ESO ON SES.SES_ESTADO_ID = ESO.ESO_ID
        WHERE SES.SES_FECHA = (
            SELECT MAX(SES2.SES_FECHA)
            FROM SOLICITUD_ESTADO SES2
            WHERE SES2.SES_SOLICITUD_ID = SOE.SOE_ID
        )
            ${whereEstado}
        ORDER BY SOE.SOE_FECHA DESC
    `);

    return result.recordset;
};

exports.getById = async (id) => {
    const pool = await connectToAlum();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
            SELECT 
                SOE.*, 
                TOE.TOE_DESCRIPCION,
                TOE.TOE_INTERNO,
                LOC.LOC_DESCRIPCION,
                SES.SES_FECHA, 
                ESO.ESO_DESCRIPCION
            FROM SOLICITUD_OBRA_ELECTRICA SOE
            LEFT JOIN TIPO_OBRA_ELECTRICA TOE ON TOE.TOE_ID = SOE.SOE_TIPO_ID
            LEFT JOIN GEA.dbo.LOCALIDAD LOC ON LOC.LOC_ID = SOE.SOE_LOCALIDAD_ID
            LEFT JOIN SOLICITUD_ESTADO SES ON SES.SES_SOLICITUD_ID = SOE.SOE_ID
            LEFT JOIN ESTADO_SOLICITUD_OBRA ESO ON ESO.ESO_ID = SES.SES_ESTADO_ID
            WHERE SOE.SOE_ID = @id
        `);

        return result.recordset[0];
}

exports.create = async (data) => {
    const {
        cuit, apellido, nombre, calle, altura, piso, dpto,
        localidad, celular, email, tipo, usuario
    } = data;

    const fechaActual = new Date();
    const pool = await connectToAlum();

    const result = await pool.request()
        .input('cuit', sql.VarChar, cuit)
        .input('apellido', sql.VarChar, apellido)
        .input('nombre', sql.VarChar, nombre)
        .input('calle', sql.VarChar, calle)
        .input('altura', sql.VarChar, altura)
        .input('piso', sql.VarChar, piso)
        .input('dpto', sql.VarChar, dpto)
        .input('localidad', sql.Int, localidad)
        .input('celular', sql.VarChar, celular)
        .input('email', sql.VarChar, email)
        .input('tipo', sql.Int, tipo)
        .input('usuario', sql.VarChar, usuario)
        .input('fecha', sql.DateTime, fechaActual)
        .input('update', sql.DateTime, fechaActual)
        .query(`
            INSERT INTO SOLICITUD_OBRA_ELECTRICA (
                SOE_CUIT, SOE_APELLIDO, SOE_NOMBRE, SOE_CALLE, SOE_ALTURA,
                SOE_PISO, SOE_DPTO, SOE_LOCALIDAD_ID, SOE_CELULAR, SOE_EMAIL,
                SOE_TIPO_ID, SOE_USUARIO, SOE_FECHA, SOE_UPDATE
            )
            OUTPUT INSERTED.SOE_ID
            VALUES (
                @cuit, @apellido, @nombre, @calle, @altura,
                @piso, @dpto, @localidad, @celular, @email,
                @tipo, @usuario, @fecha, @update
            )
        `);

    const solicitudId = result.recordset[0].SOE_ID;

    const tipoObra = await pool.request()
        .input('tipo', sql.Int, tipo)
        .query('SELECT TOE_INTERNO FROM TIPO_OBRA_ELECTRICA WHERE TOE_ID = @tipo');

    const estadoId = 4; // Siempre inicia en estado "Iniciada"

    await pool.request()
        .input('solicitudId', sql.Int, solicitudId)
        .input('estadoId', sql.Int, estadoId)
        .input('usuario', sql.VarChar, usuario)
        .input('fecha', sql.DateTime, fechaActual)
        .query(`
            INSERT INTO SOLICITUD_ESTADO (
                SES_SOLICITUD_ID, SES_ESTADO_ID, SES_USUARIO, SES_FECHA
            ) VALUES (
                @solicitudId, @estadoId, @usuario, @fecha
            )
        `);

    return solicitudId;
};

exports.remove = async (id) => {
    const pool = await connectToAlum();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM SOLICITUD_OBRA_ELECTRICA WHERE SOE_ID = @id');

    return result.rowsAffected[0];
};
