// Operaciones con tipos de obra
const tipoObraModel = require('../../models/obrasElec/tipoObra');

module.exports = {
    async index(req, res) {
        try {
            const tipos = await tipoObraModel.getAll();
            res.json(tipos);
        } catch (err) {
            console.error('Error al listar tipos de obra:', err);
            res.status(500).json({ error: 'Error al obtener tipos de obra.' });
        }
    },

    async store(req, res) {
        try {
            const { abreviatura, descripcion, interno } = req.body;
            const internoFinal = (interno === true || interno === 'S') ? 'S' : 'N';

            const existente = await tipoObraModel.findByAbreviatura(abreviatura);
            if (existente) return res.status(400).json({ error: 'La abreviatura ya existe.' });

            await tipoObraModel.create({ abreviatura, descripcion, interno: internoFinal });
            res.status(201).json({ message: 'Tipo de obra creada correctamente.' });
        } catch (e) {
            console.error('Error al crear tipo de obra:', err);
            res.status(500).json({ error: 'Error al crear tipo de obra.' });
        }
    },

    async update(req, res) {
        try {
            const id = req.params.id;
            const { abreviatura, descripcion, interno } = req.body;
            const internoFinal = (interno === true || interno === 'S') ? 'S' : 'N';

            const existente = await tipoObraModel.findById(id);
            if (!existente) return res.status(404).json({ error: 'Tipo de obra no encontrado.' });

            const duplicado = await tipoObraModel.findAbreviaturaDuplicate(abreviatura, id);
            if (duplicado) return res.status(400).json({ error: 'La abreviatura ya existe en otro registro.' });

            await tipoObraModel.update(id, { abreviatura, descripcion, interno: internoFinal });
            res.json({ message: 'Tipo de obra actualizada correctamente.' });
        } catch (err) {
            console.error('Error al actualizar tipo de obra:', err);
            res.status(500).json({ error: 'Error al actualizar tipo de obra.' });
        }
    },

    async destroy(req, res) {
        try {
            const id = req.params.id;
            const eliminado = await tipoObraModel.remove(id);
            if (!eliminado) return res.status(404).json({ error: 'Tipo de obra no encontrado.' });

            res.json({ message: 'Tipo de obra eliminada correctamente.' });
        } catch (err) {
            console.error('Error al eliminar tipo de obra:', err);
            res.status(500).json({ error: 'Error al eliminar tipo de obra.' });
        }
    }
};
