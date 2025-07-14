const solicitudModel = require('../../models/obrasElec/Solicitud');

module.exports = {
    async index(req, res) {
        try {
            const { estado } = req.query;
            const solicitudes = await solicitudModel.getAll(estado);
            res.json(solicitudes);
        } catch (err) {
            console.error('Error al obtener solicitudes:', err);
            res.status(500).json({ error: 'Error al obtener solicitudes' });
        }
    },

    async store(req, res) {
        try {
            const solicitudId = await solicitudModel.create(req.body);
            res.status(201).json({ message: 'Solicitud creada correctamente.' });

        } catch (error) {
            console.error('Error al crear solicitud:', error);
            res.status(500).json({ error: 'Error al crear solicitud.' });
        }
    },

    async show(req, res) {
        try{
            const { id } = req.params;
            const solicitud = await solicitudModel.getById(id);

            if(!solicitud) {
                return res.status(404).json({ error: 'Solicitud no encontrada.'});
            }

            res.json(solicitud);
        }catch (err) {
            console.error('Error al obtener la solicitud: ', err);
            res.status(500).json({ error: 'Error al obtener la solicitud.'});
        }
    },

    async destroy(req, res) {

        try {
            const { id } = req.params;
            const rowsAffected = await solicitudModel.remove(id);

            if (rowsAffected === 0) {
                return res.status(404).json({ error: 'Solicitud no encontrada.' });
            }

            res.json({ message: 'Solicitud eliminada correctamente.' });
        } catch (error) {
            console.error('Error al eliminar la solicitud:', error);
            res.status(500).json({ error: 'Error al eliminar la solicitud.' });
        }
    }
}