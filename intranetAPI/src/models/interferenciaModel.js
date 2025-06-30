const { request } = require('express');
const { connectToGeaCorpico, sql } = require('../config/db');

exports.getAll = async (res, req) => {
    const pool = await connectToGeaCorpico();

    const request = pool.request();
    const result = await request.query(`
        SELECT 
            SOI.SOI_ID as ID,
            SOI.SOI_CUIT as CUIT_DNI,
            SOI.SOI_NOMBRE as Nombre,
            SOI.SOI_APELLIDO as Apellido,
            SOI.SOI_PERSONA as Es_persona,
            SOI.SOI_EMAIL as Email,
            SOI.SOI_CALLE as Calle,
            SOI.SOI_ALTURA as Altura,
            SOI.SOI_PISO as Piso,
            SOI.SOI_DPTO as Dpto,
            SOI.SOI_VEREDA as Vereda,
            SOI.SOI_ENTRE1 as Entre1,
            SOI.SOI_ENTRE2 as Entre2,
            LOC.LOC_DESCRIPCION as Localidad,
            SOI.SOI_LATITUD as Latitud,
            SOI.SOI_LONGITUD as Longitud,
            SOI.SOI_DESDE as Desde,
            SOI.SOI_HASTA as Hasta,
            SOI.SOI_FECHA as Fecha_interf,
            SOI.SOI_MAPA as Mapa,
            SOI.SOI_PATH as Path
        FROM SOLICITUD_INTERFERENCIA SOI
        INNER JOIN LOCALIDAD LOC ON LOC.LOC_ID = SOI.SOI_LOCALIDAD_ID;

    `);
    return result.recordset;
};

exports.create = async (data) => {
    const {
        cuit, nombre, apellido, es_persona, email, calle, altura, piso, dpto, vereda,
        entre1, entre2, localidad, latitud, longitud, desde, hasta, //fecha_interf, 
        mapa, path
    } = data;

    const fechaActual = new Date();
    const pool = await connectToGeaCorpico();

    const result = await pool.request()
        .input('cuit', sql.VarChar, cuit)
        .input('nombre', sql.VarChar, nombre)
        .input('apellido', sql.VarChar, apellido)
        .input('es_persona', sql.Char, es_persona)
        .input('email', sql.VarChar, email)
        .input('calle', sql.VarChar, calle)
        .input('altura', sql.VarChar, altura)
        .input('piso', sql.VarChar, piso || null)
        .input('dpto', sql.VarChar, dpto || null)
        .input('vereda', sql.Char, vereda)
        .input('entre1', sql.VarChar, entre1)
        .input('entre2', sql.VarChar, entre2)
        .input('localidad', sql.Int, localidad)
        .input('latitud', sql.Decimal, latitud)
        .input('longitud', sql.Decimal, longitud)
        .input('desde', sql.Date, desde)
        .input('hasta', sql.Date, hasta)
        .input('fecha', sql.DateTime, fechaActual)
        .input('mapa', sql.VarChar, mapa)
        .input('path', sql.VarChar, path)
        .query(`
            INSERT INTO SOLICITUD_INTERFERENCIA (
                SOI_CUIT, SOI_NOMBRE, SOI_APELLIDO, SOI_PERSONA, SOI_EMAIL, SOI_CALLE,
                SOI_ALTURA, SOI_PISO, SOI_DPTO, SOI_VEREDA, SOI_ENTRE1, SOI_ENTRE2, SOI_LOCALIDAD_ID, 
                SOI_LATITUD, SOI_LONGITUD, SOI_DESDE, SOI_HASTA, SOI_FECHA, SOI_MAPA, SOI_PATH
            )
            OUTPUT INSERTED.SOI_ID
            VALUES (
                @cuit, @nombre, @apellido, @es_persona, @email, @calle, @altura,
                @piso, @dpto, @vereda, @entre1, @entre2, @localidad, @latitud, @longitud,
                @desde, @hasta, @fecha, @mapa, @path
            )
        `);

    const solicitudId = result.recordset[0].SOI_ID;

    return solicitudId;
};

exports.remove = async (id) => {
    const pool = await connectToGeaCorpico();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM SOLICITUD_INTERFERENCIA WHERE SOI_ID = @id');

    return result.rowsAffected[0];
};

exports.update = async (id, data) => {
    const {
        cuit, nombre, apellido, es_persona, email, calle, altura, piso, dpto, vereda,
        entre1, entre2, localidad, latitud, longitud, desde, hasta,
        mapa, path
    } = data;

    const fechaActual = new Date();
    const pool = await connectToGeaCorpico();

    const result = await pool.request()
        .input('id', sql.Int, id)
        .input('cuit', sql.VarChar, cuit)
        .input('nombre', sql.VarChar, nombre)
        .input('apellido', sql.VarChar, apellido)
        .input('es_persona', sql.Char, es_persona)
        .input('email', sql.VarChar, email)
        .input('calle', sql.VarChar, calle)
        .input('altura', sql.VarChar, altura)
        .input('piso', sql.VarChar, piso || null)
        .input('dpto', sql.VarChar, dpto || null)
        .input('vereda', sql.Char, vereda)
        .input('entre1', sql.VarChar, entre1)
        .input('entre2', sql.VarChar, entre2)
        .input('localidad', sql.Int, localidad)
        .input('latitud', sql.Decimal, latitud)
        .input('longitud', sql.Decimal, longitud)
        .input('desde', sql.Date, desde)
        .input('hasta', sql.Date, hasta)
        .input('fecha', sql.DateTime, fechaActual)
        .input('mapa', sql.VarChar, mapa)
        .input('path', sql.VarChar, path)
        .query(`
            UPDATE SOLICITUD_INTERFERENCIA SET
                SOI_CUIT = @cuit,
                SOI_NOMBRE = @nombre,
                SOI_APELLIDO = @apellido,
                SOI_PERSONA = @es_persona,
                SOI_EMAIL = @email,
                SOI_CALLE = @calle,
                SOI_ALTURA = @altura,
                SOI_PISO = @piso,
                SOI_DPTO = @dpto,
                SOI_VEREDA = @vereda,
                SOI_ENTRE1 = @entre1,
                SOI_ENTRE2 = @entre2,
                SOI_LOCALIDAD_ID = @localidad,
                SOI_LATITUD = @latitud,
                SOI_LONGITUD = @longitud,
                SOI_DESDE = @desde,
                SOI_HASTA = @hasta,
                SOI_FECHA = @fecha,
                SOI_MAPA = @mapa,
                SOI_PATH = @path
            WHERE SOI_ID = @id
        `);

    return result.rowsAffected[0]; // Devuelve cuántas filas se actualizaron
};

exports.getLocalidades = async () => {
    const pool = await connectToGeaCorpico();
    const result = await pool.request().query(`
        SELECT LOC_ID, LOC_DESCRIPCION FROM LOCALIDAD ORDER BY LOC_DESCRIPCION
  `);
  return result.recordset;
};


exports.getById = async (id) => {
    const pool = await connectToGeaCorpico();

    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
            SELECT 
                SOI.SOI_ID as ID,
                SOI.SOI_CUIT as CUIT_DNI,
                SOI.SOI_NOMBRE as Nombre,
                SOI.SOI_APELLIDO as Apellido,
                SOI.SOI_PERSONA as Es_persona,
                SOI.SOI_EMAIL as Email,
                SOI.SOI_CALLE as Calle,
                SOI.SOI_ALTURA as Altura,
                SOI.SOI_PISO as Piso,
                SOI.SOI_DPTO as Dpto,
                SOI.SOI_VEREDA as Vereda,
                SOI.SOI_ENTRE1 as Entre1,
                SOI.SOI_ENTRE2 as Entre2,
                LOC.LOC_DESCRIPCION as Localidad,
                SOI.SOI_LATITUD as Latitud,
                SOI.SOI_LONGITUD as Longitud,
                SOI.SOI_DESDE as Desde,
                SOI.SOI_HASTA as Hasta,
                SOI.SOI_FECHA as Fecha_interf,
                SOI.SOI_MAPA as Mapa,
                SOI.SOI_PATH as Path
            FROM SOLICITUD_INTERFERENCIA SOI
            INNER JOIN LOCALIDAD LOC ON LOC.LOC_ID = SOI.SOI_LOCALIDAD_ID
            WHERE SOI.SOI_ID = @id
        `);

    return result.recordset[0]; // Devuelve un solo objeto (o undefined si no existe)
};
