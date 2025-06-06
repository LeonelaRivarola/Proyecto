const presupuestoModel = require('../models/presupuestoModel');

module.exports = {

    async index(req, res) {
        try {
            const presupuestos = await presupuestoModel.getAll();
            res.json(presupuestos);
        } catch (err) {
            console.log('Error al obtener los Presupuestos');
            res.status(500).json({ error: 'Error al obtener los presupuestos' });
        }
    },

    async showPresupuestoPath(req, res) {
        try {
            const usuario = req.params.usuario;
            const path = await presupuestoModel.getPresupuestoPath(usuario);
            if (!path) return res.status(404).json({ error: 'Path no encontrado.' });
            res.json(path);
        } catch (err) {
            console.error('Error al obtener path:', err);
            res.status(500).json({ error: 'Error al obtener path.' });
        }
    }
}