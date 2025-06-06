const presupuestoModel = require('../models/presupuestoModel');

module.exports = {

    async index(req, res){
        try{
            const presupuestos = await presupuestoModel.getAll();
            res.json(presupuestos);
        } catch(err){
            console.log('Error al obtener los Presupuestos');
            res.status(500).json({error: 'Error al obtener los presupuestos'});
        }
    }
}