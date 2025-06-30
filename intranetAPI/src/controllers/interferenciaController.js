const interfModel = require('../models/interferenciaModel')

module.exports = {
    async index(req, res) {
        try {
            const interferencias = await interfModel.getAll();
            res.json(interferencias);
        } catch (err) {
            console.error('Error al obtener solicitudes:', err);
            res.status(500).json({ error: 'Error al obtener solicitudes' });
        }
    },

    async show(req, res) {
        try {
            const { id } = req.params;
            const interferencia = await interfModel.getById(id);

            if (!interferencia) {
                return res.status(404).json({ error: 'Interferencia no encontrada.' });
            }

            res.json(interferencia);
        } catch (error) {
            console.error('Error al obtener la interferencia:', error);
            res.status(500).json({ error: 'Error al obtener la interferencia.' });
        }
    },

    async store(req, res) {
        try {
            const solicitudId = await interfModel.create(req.body);
            // res.json(solicitudId);
            res.status(201).json({ message: 'Solicitud creada correctamente.' });

        } catch (error) {
            console.error('Error al crear solicitud:', error);
            res.status(500).json({ error: 'Error al crear solicitud.' });
        }
    },

    async destroy(req, res) {

        try {
            const { id } = req.params;
            const rowsAffected = await interfModel.remove(id);

            if (rowsAffected === 0) {
                return res.status(404).json({ error: 'interferencia no encontrada.' });
            }

            res.json({ message: 'Interferencia eliminada correctamente.' });
        } catch (error) {
            console.error('Error al eliminar la interferencia:', error);
            res.status(500).json({ error: 'Error al eliminar la interferencia.' });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            const updated = await interfModel.update(id, data);

            if (updated === 0) {
                return res.status(404).json({ message: 'Solicitud no encontrada.' });
            }

            res.json({ message: 'Solicitud actualizada correctamente.' });
        } catch (error) {
            console.error('Error al actualizar la solicitud:', error);
            res.status(500).json({ error: 'Error al actualizar la solicitud.' });
        }
    }
};