const { connectToAlum, sql } = require('../../config/db'); // conexión a la base de datos
const dayjs = require('dayjs');

module.exports = {
    async getUltimosPresupuestosIds() {
        const pool = await connectToAlum();
        const result = await pool.request()
            .query(`
                SELECT MAX(id) AS id
                FROM presupuesto
                GROUP BY solicitud_id
            `);
        return result.recordset.map(r => r.id);
    },

    async getPresupuestosByIds(ids) {
        const pool = await connectToAlum();
        const placeholders = ids.map((_, i) => `@id${i}`).join(', ');

        const request = pool.request();
        ids.forEach((id, i) => request.input(`id${i}`, sql.Int, id));

        const result = await request.query(
            `SELECT * FROM presupuesto WHERE id IN (${placeholders})`, ids
        );
        return result.recordset;
    },

    async crear(data) {
        const fechaActual = new Date();
        const pool = await connectToAlum();

        const result = await pool.request()
            .input('path', sql.VarChar, data.path)
            .input('notifica', sql.VarChar, data.notifica || 'N')
            .input('veces', sql.Int, data.veces || 0)
            .input('usuario_notifica', sql.VarChar, data.usuario_notifica || null)
            .input('fecha_notifica', sql.DateTime, data.fecha_notifica || null)
            .input('created_at', sql.DateTime, fechaActual)
            .query(`
                INSERT INTO PRESUPUESTO (
                    PATH, NOTIFICA, VECES_NOTIFICA, USUARIO_NOTIFICA, FECHA_NOTIFICA, CREATED_AT
                )
                OUTPUT INSERTED.ID
                VALUES (
                    @path, @notifica, @veces, @usuario_notifica, @fecha_notifica, @created_at
                )
            `);
        return { id: result.recorset[0].ID };
    },

    async crearEstado(solicitudId, estadoId) {
        const fecha = new Date();
        const pool = await connectToAlum();

        const result = await pool.request()
            .input('solicitudId', sql.Int, solicitudId)
            .input('estadoId', sql.Int, estadoId)
            .input('fecha', sql.DateTime, fecha)
            .query(`
                INSERT INTO ESTADO_SOLICITUD (SOLICITUD_ID, ESTADO_ID, FECHA)
                OUTPUT INSERTED.ID
                VALUES (@solicitudId, @estadoId, @fecha)
            `);
        return { id: result.recordset[0].ID };
    },

    async crearSolicitudPresupuesto({ solicitud_id, presupuesto_id, usuario, fecha }) {
        const pool = await connectToAlum();

        await pool.request()
        .input('solicitud_id', sql.Int, solicitud_id)
        .input('presupuesto_id', sql.Int, presupuesto_id)
        .input('usuario', sql.VarChar, usuario)
        .input('fecha', sql.DateTime, fecha)
        .query(`
            INSERT INTO SOLICITUD_PRESUPUESTO (SOLICITUD_ID, PRESUPUESTO_ID, USUARIO, FECHA)
            VALUES (@solicitud_id, @presupuesto_id, @usuario, @fecha)
        `);
    },

    async crearObservacion(estado_id, observacion) {
        const pool = await connectToAlum();

        await pool.request()
        .input('estado_id', sql.Int, estado_id)
        .input('texto', sql.VarChar, observacion)
        .query(`
            INSERT INTO OBSERVACION (ESTADO_ID, TEXTO)
            VALUES (@estado_id, @texto)
        `);
    }, 

    async actualizarPresupuesto(solicitud) {
         const pool = await connectToAlum();

    await pool.request()
        .input('asociado', sql.VarChar, solicitud.asociado)
        .input('suministro', sql.VarChar, solicitud.suministro)
        .input('id', sql.Int, solicitud.ultimo_presupuesto_id)
        .query(`
            UPDATE PRESUPUESTO
            SET ASOCIADO = @asociado, SUMINISTRO = @suministro
            WHERE ID = @id
        `);
        },

    async getUltimoPresupuestoBySolicitudId(solicitudId) {
        const pool = await connectToAlum();
        
        const result = await poll.request()
            input('solicitud', sql.Int, solicitudId)
            .query(`
                 SELECT TOP 1 * FROM PRESUPUESTO
                WHERE SOLICITUD_ID = @solicitudId
                ORDER BY ID DESC
            `);
        return result.recordset[0];
    },

    async incrementarNotificacion(presupuestoId, usuarioCodigo) {
         const pool = await connectToAlum();
    const fecha = new Date();

    await pool.request()
        .input('usuario', sql.VarChar, usuarioCodigo)
        .input('fecha', sql.DateTime, fecha)
        .input('id', sql.Int, presupuestoId)
        .query(`
            UPDATE PRESUPUESTO
            SET VECES_NOTIFICA = VECES_NOTIFICA + 1,
                USUARIO_NOTIFICA = @usuario,
                FECHA_NOTIFICA = @fecha
            WHERE ID = @id
        `);
    },

    async enviarEmail(data, solicitud, archivoPath) {
        // Simulación del envío (podés integrar nodemailer aquí)
        console.log(`📧 Enviando email a ${solicitud.email} con archivo: ${archivoPath}`);
        // Implementación real sería con nodemailer o algún servicio SMTP.
    }
};
