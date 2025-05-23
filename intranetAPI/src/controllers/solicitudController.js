// CRUD de solicitudes
const { connectToGeaSeguridad, sql } = require('../config/db');


exports.solicitudes = async (req, res) => {
    try {
        const pool = await connectToGeaSeguridad();
const result = await pool.request().query(`
    SELECT 
        SOE.SOE_ID,
        SOE.SOE_FECHA,
        TOE.TOE_DESCRIPCION AS Tipo,
        CONCAT(SOE.SOE_APELLIDO, ' ', SOE.SOE_NOMBRE) AS Usuario,
        ESO.ESO_DESCRIPCION AS Estado,
        SOE.SOE_UPDATE,
        SOE.SOE_USUARIO,
        SOE.SOE_CUIT
    FROM SOLICITUD_OBRA_ELECTRICA AS SOE
    INNER JOIN TIPO_OBRA_ELECTRICA AS TOE ON SOE.SOE_TIPO_ID = TOE.TOE_ID
    INNER JOIN SOLICITUD_ESTADO AS SES ON SES.SES_SOLICITUD_ID = SOE.SOE_ID
    INNER JOIN ESTADO_SOLICITUD_OBRA AS ESO ON SES.SES_ESTADO_ID = ESO.ESO_ID
    ORDER BY SOE.SOE_FECHA DESC
`);


        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener solicitudes:', err);
        res.status(500).json({ error: 'Error al obtener solicitudes' });
    }
}


