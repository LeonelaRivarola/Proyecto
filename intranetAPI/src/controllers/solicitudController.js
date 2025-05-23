// CRUD de solicitudes
const { connectToGeaSeguridad, sql } = require('../config/db');

exports.solicitudes = async (req, res) => {
    try {
        const pool = await connectToAlum();

        const base = await pool.request().query('SELECT DB_NAME() AS base_actual');
        console.log('Conectado a la base:', base.recordset[0].base_actual); // Debería decir: alum

        const result = await pool.request().query(`
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
                ORDER BY SOE.SOE_FECHA DESC
            `);

        // const result = await pool.request().query(`
        //     SELECT 
        //         SOE.SOE_ID as Número,
        //         SOE.SOE_FECHA AS Fecha_Solicitud,
        //         ESO.ESO_DESCRIPCION AS Estado,
        //         SOE.SOE_UPDATE AS Fecha_Estado,
        //         SOE.SOE_USUARIO AS Usuario,
        //         TOE.TOE_DESCRIPCION AS Tipo,
        //         SOE.SOE_CUIT AS DNI_CUIT,
        //         SOE.SOE_APELLIDO AS Apellido, 
        //         SOE.SOE_NOMBRE AS Nombre
        //     FROM SOLICITUD_OBRA_ELECTRICA AS SOE
        //     INNER JOIN TIPO_OBRA_ELECTRICA AS TOE ON SOE.SOE_TIPO_ID = TOE.TOE_ID
        //     INNER JOIN SOLICITUD_ESTADO AS SES ON SES.SES_SOLICITUD_ID = SOE.SOE_ID
        //     INNER JOIN ESTADO_SOLICITUD_OBRA AS ESO ON SES.SES_ESTADO_ID = ESO.ESO_ID
        //     ORDER BY SOE.SOE_FECHA DESC
        // `);


        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener solicitudes:', err);
        res.status(500).json({ error: 'Error al obtener solicitudes' });
    }
}

