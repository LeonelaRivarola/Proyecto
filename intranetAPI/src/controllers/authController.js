const bcrypt = require('bcrypt');
// const { findUserByUsername } = require('../models/userModel');
const { connectToGeaSeguridad, sql, connectToAlum } = require('../config/db');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'Co23pi08cO';

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const pool = await connectToGeaSeguridad();
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT USU_CODIGO, USU_PASSWORD FROM dbo.USUARIOS WHERE USU_CODIGO = @username');

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const user = result.recordset[0];
        console.log('Password desde la BD:', user.USU_PASSWORD);
        console.log('Password enviado:', password);

        // si las contraseñas está en texto plano (me parece)
        if (user.USU_PASSWORD.trim() === password) {
            const token = jwt.sign(
                {
                    username: user.USU_CODIGO
                },
                SECRET_KEY,
                { expiresIn: '1h' }
            );
            return res.json({ token });
        } else {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        //contraseña hasheada
        // const passwHash = user.USU_PASSWORD;
        // console.log('Hash recuperado de BD:', passwHash);

        // const passwordValida = await bcrypt.compare(password, passwHash);

        // if (!passwordValida) {
        //     return res.status(401).json({ message: "Contraseña incorrecta" });
        // }

        // const token = jwt.sign({ username: user.USU_CODIGO },
        //     SECRET_KEY,
        //     { expiresIn: '1h' });

        // return res.json({ token });

    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

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

