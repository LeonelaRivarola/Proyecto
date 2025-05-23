const { connectToAlum, sql } = require('../config/db');

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

exports.crearSolicitud = async (req, res) => {
    try {
        const {
            cuit,
            apellido,
            nombre,
            calle,
            altura,
            piso,
            dpto,
            localidad,
            celular,
            email,
            tipo,
            usuario // Esto lo tenés que pasar desde el frontend o desde el token JWT si ya lo estás usando
        } = req.body;

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
            .query(
                `
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

            const esInterno = tipoObra.recordset[0]?.TOE_INTERNO === 'S';

        // Determinar estado
        const estadoId = (cuit === '30545719386' && esInterno) ? 5 : 4;

        // Insertar estado de la solicitud
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

        res.status(201).json({ message: 'Solicitud creada correctamente.' });

    } catch (error) {
        console.error('Error al crear solicitud:', error);
        res.status(500).json({ error: 'Error al crear solicitud.' });
    }
};