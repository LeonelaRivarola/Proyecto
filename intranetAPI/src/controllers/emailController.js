const emailsModel = require('../models/emailsModel');

module.exports = {

    async index(req, res) {
        try {
            const emails = await emailsModel.getAll();
            res.json(emails);
        } catch (err) {
            console.error('Error al obtener los Emails:', err);
            res.status(500).json({ error: 'Error al obtener Emails' });
        }
    }

}