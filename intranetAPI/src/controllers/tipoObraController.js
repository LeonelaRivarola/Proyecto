// Operaciones con tipos de obra
const { connectToAlum, sql } = require('../config/db');
const TipoObra = require('../models/tipoObra');

module.exports = {
    async index(req, res) {
        const tiposObras = await TipoObra.findAll();
        res.json(tiposObras);
    },

    async store(req, res) {
        try {
            const { abreviatura, descripcion, interno } = req.body;

            await TipoObra.create({
                TOE_ABREVIATURA: abreviatura,
                TOE_DESCRIPCION: descripcion,
                TOE_INTERNO: interno === true || interno === 'S' ? 'S' : 'N',
            });
            res.status(201).json({ message: 'Tipo de obra creada correctamente' });
        } catch (e) {
            if (e.name === 'SequalizeUniqueContraintError') {
                res.status(400).json({ error: 'La abreviatura ya existe.' });
            } else {
                res.status(500).json({ error: 'Ocurrió un error inesperado' });
            }
        }
    },

    async update(req, res) {
        try {
            const id = req.params.id;
            const tipoObra = await TipoObra.findByPk(id);
            if (!tipoObra) return res.status(404).json({ error: 'Tipo de Obra no encontrado.' });

            const { abreviatura, descripcion, interno } = req.body;

            await tipoObra.update({
                TOE_ABREVIATURA: abreviatura,
                TOE_DESCRIPCION: descripcion,
                TOE_INTERNO: interno === true || interno === 'S' ? 'S' : 'N',
            });

            res.json({ message: 'Tipo de Obra actualizada correctamente' })
        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json({ error: 'La abreviatura ya existe.' });
            } else {
                res.status(500).json({ error: 'Ocurrió un error inesperado.' });
            }
        }
    },

    async destroy(req, res) {
    const id = req.params.id;
    const tipoObra = await TipoObra.findByPk(id);
    if (!tipoObra) return res.status(404).json({ error: 'Tipo de Obra no encontrado.' });

    await tipoObra.destroy();
    res.json({ message: 'Tipo de Obra eliminada correctamente.' });
  }
};
