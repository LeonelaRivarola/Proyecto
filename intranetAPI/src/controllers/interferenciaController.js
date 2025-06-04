const interfModel = require('../models/interferenciaModel')
module.exports = {
    async index(req, res) {
        try {
            const solicitudes = await interfModel.getAll();
            res.json(solicitudes);
        } catch (err) {
            console.error('Error al obtener solicitudes:', err);
            res.status(500).json({ error: 'Error al obtener solicitudes' });
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
        }
}
