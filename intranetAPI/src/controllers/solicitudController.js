const solicitudModel = require('../models/solicitudModel');

exports.solicitudes = async (req, res) => {
    try {
        const solicitudes = await solicitudModel.obtenerSolicitudes();
        res.json(solicitudes);
    } catch (err) {
        console.error('Error al obtener solicitudes:', err);
        res.status(500).json({ error: 'Error al obtener solicitudes' });
    }
}

exports.crearSolicitud = async (req, res) => {
    try {
        const solicitudId = await solicitudModel.crearSolicitud(req.body);
        res.status(201).json({ message: 'Solicitud creada correctamente.' });

    } catch (error) {
        console.error('Error al crear solicitud:', error);
        res.status(500).json({ error: 'Error al crear solicitud.' });
    }
};

exports.eliminar = async (req, res) => {

    try{
        const { id } = req.params;
        const rowsAffected = await solicitudModel.eliminarSolicitud(id);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada.' });
        }

        res.json({ message: 'Solicitud eliminada correctamente.' });
    }catch(error) {
        console.error('Error al eliminar la solicitud:', error);
        res.status(500).json({ error: 'Error al eliminar la solicitud.' });
    }
}