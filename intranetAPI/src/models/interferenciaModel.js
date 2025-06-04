const { request } = require('express');
const { connectToGeaCorpico, sql } = require('../config/db');

exports.getAll = async (res, req) => {
    const pool = await connectToGeaCorpico();

    const request = pool.request();
    const result = await request.query(`
        SELECT 
            SOI_ID as ID,
            SOI_CUIT as DNI/CUIT,
            SOI_NOMBRE as Nombre,
            SOI_APELLIDO as Apellido,
            SOI_PERSONA as Es_persona,
            SOI_EMAIL as Email,
            SOI_CALLE as Calle,
            SOI_ALTURA as Altura,
            SOI_PISO as Piso,
            SOI_DPTO as Dpto,
            SOI_VEREDA as Vereda,
            SOI_ENTRE1 as Entre1,
            SOI_ENTRE2 as Entre2,
            SOI_LOCALIDAD_ID as ID_Localidad,
            SOI_LATITUD as Latitud,
            SOI_LONGITUD as Longitud,
            SOI_DESDE as Desde,
            SOI_HASTA as Hasta,
            SOI_FECHA as Fecha_interf,
            SOI_MAPA as Mapa,
            SOI_PATH as Path
        FROM SOLICITUD_INTERFERENCIA
    `);
    return result.recordset;
};

exports.create = async (data) => {
    const {
        cuit, nombre, apellido, es_persona, email, calle, altura, piso, dpto, vereda,
        entre1, entre2, localidad, lat, long,  desde, hasta, //fecha_interf, 
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
        .input('piso', sql.VarChar, piso)
        .input('dpto', sql.VarChar, dpto)
        .input('entre1', sql.VarChar, entre1)
        .input('entre2', sql.VarChar, entre2)
        .input('localidad', sql.Int, localidad)
        .input('lat', sql.Decimal, lat)
        .input('long', sql.Decimal, long)
        .input('desde', sql.Date, desde)
        .input('hasta', sql.Date, hasta)
        .input('fecha_interf', sql.DateTime, fechaActual)
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
