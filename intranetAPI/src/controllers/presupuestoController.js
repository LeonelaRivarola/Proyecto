// Operaciones con presupuestosgit restore . 
const presupuestoModel = require('../models/presupuestoModel');
const path = require('path');
const fs = require('fs');
const dayjs = require('dayjs');

module.exports = {
    async index(req, res) {
        try{
            const pathPresupuestos = process.env.NAS_PATH_PRESUPUESTOS;

            if(!fs.existsSync(pathPresupuestos)){
                return res.status(404).json({ error: 'La carpeta de presupuestos no existe.' });
            }

            const archivos = fs.readdirSync(pathPresupuestos).filter(name => name !== '.' && name !== '..');

            const ultimosPresupuestosIds = await presupuestoModel.getUltimosPresupuestosIds();
            const presupuestos = await presupuestoModel.getPresupuestosByIds(ultimosPresupuestosIds);

            const archivosConDatos = [];

            for( const presupuesto of presupuestos){
                const archivoNombre = path.basename(presupuesto.path);

                if (!archivos.includes(archivoNombre)) continue;

                const solicitud = await solicitudModel.getById(presupuesto.solicitud_id);

                archivosConDatos.push({
                    archivo: archivoNombre,
                    nombre: solicitud.nombre ?? 'Desconocido',
                    apellido: solicitud.apellido ?? 'Desconocido',
                    calle: solicitud.calle ?? 'Desconocido',
                    ultimo_presupuesto: presupuesto.path,
                });
            }

            res.json(archivosConDatos);
        } catch (err) {
            console.error('Error en index:', err);
            res.status(500).json({ error: 'Error al obtener presupuestos' });
        }
    },

    async show(req, res) {
        const { nombreArchivo } = req.params;
        const archivoPath = path.join(process.env.NAS_PATH_PRESUPUESTOS, nombreArchivo);

        if (!fs.existsSync(archivoPath)) {
            return res.status(404).send('Archivo no encontrado');
        }

        res.sendFile(archivoPath);
    },

    async store(req, res) {
        const { nombre, solicitudId, emailNotificar, subestacion } = req.body;
        const archivoPath = path.join(process.env.NAS_PATH_PRESUPUESTOS, nombre);

        try {
            // 1. Insertar presupuesto
            const estadoNotifica = emailNotificar ? {
                notifica: 'S',
                veces: 1,
                usuario_notifica: req.user.codigo, // depende cómo tengas auth
                fecha_notifica: new Date()
            } : {
                notifica: 'N'
            };

            const nuevoPresupuesto = await presupuestoModel.crear({
                path: archivoPath,
                ...estadoNotifica
            });

            // 2. Actualizar solicitud si tiene subestación
            if (subestacion) {
                await solicitudModel.actualizar(solicitudId, {
                    subestacion,
                    usuario: req.user.codigo,
                    update_at: new Date()
                });
            }

            // 3. Crear estado nuevo (presupuestada)
            await presupuestoModel.crearEstado(solicitudId, 6); // Estado 6

            // 4. Asociar presupuesto a solicitud
            await presupuestoModel.crearSolicitudPresupuesto({
                solicitud_id: solicitudId,
                presupuesto_id: nuevoPresupuesto.id,
                usuario: req.user.codigo,
                fecha: new Date()
            });

            // 5. Enviar correo (opcional)
            if (emailNotificar) {
                await presupuestoModel.enviarEmail(req.body, solicitudId, archivoPath);
            }

            res.status(200).json({ message: 'Presupuesto creado correctamente' });
        } catch (err) {
            console.error('Error en store:', err);
            res.status(500).json({ error: 'Error al crear presupuesto' });
        }
    },

    async update(req, res) {
        const { id } = req.params;
        const { nroAsociado, nroSuministro, accion, observacion } = req.body;

        try {
            const solicitud = await solicitudModel.getWithUltimoPresupuesto(id);

            const actualizaciones = {};
            if (nroAsociado) actualizaciones.asociado = nroAsociado;
            if (nroSuministro) actualizaciones.suministro = nroSuministro;

            if (Object.keys(actualizaciones).length > 0) {
                await solicitudModel.actualizar(id, {
                    ...actualizaciones,
                    usuario: req.user.codigo,
                    update_at: new Date()
                });
            }

            const nuevoEstado = await presupuestoModel.crearEstado(id, accion === 'aceptar' ? 1 : 3);

            if (observacion) {
                await presupuestoModel.crearObservacion(nuevoEstado.id, observacion);
            }

            await presupuestoModel.actualizarPresupuesto(solicitud);

            res.json({ message: 'Solicitud actualizada correctamente' });
        } catch (err) {
            console.error('Error en update:', err);
            res.status(500).json({ error: 'Error al actualizar solicitud' });
        }
    },

async notificarEmail(req, res) {
        const { id } = req.params;

        try {
            const solicitud = await solicitudModel.getById(id);
            const presupuesto = await presupuestoModel.getUltimoPresupuestoBySolicitudId(id);

            if (!presupuesto) {
                return res.status(404).json({ error: 'No se encontró presupuesto' });
            }

            await presupuestoModel.incrementarNotificacion(presupuesto.id, req.user.codigo);
            await presupuestoModel.enviarEmail(req.body, solicitud, presupuesto.path);

            res.json({ message: 'Correo enviado correctamente' });
        } catch (err) {
            console.error('Error en notificarEmail:', err);
            res.status(500).json({ error: 'Error al enviar correo' });
        }
    },

   async abrirPresupuesto(req, res) {
        const { solicitudId } = req.params;

        try {
            const solicitud = await solicitudModel.getWithUltimoPresupuesto(solicitudId);
            const archivo = solicitud?.ultimoPresupuesto?.path;

            if (!archivo || !fs.existsSync(archivo)) {
                return res.status(404).json({ error: 'Archivo no encontrado' });
            }

            res.sendFile(archivo);
        } catch (err) {
            console.error('Error en abrirPresupuesto:', err);
            res.status(500).json({ error: 'Error al abrir presupuesto' });
        }
    },
    
};