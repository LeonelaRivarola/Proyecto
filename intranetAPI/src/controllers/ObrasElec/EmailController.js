const EmailModel = require('../models/obrasElec/interf/EmailSolicitudModel');

module.exports = {
  index: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;

    try {
      const emails = await EmailModel.getPaginatedEmails(limit, offset);
      const total = await EmailModel.getEmailCount();

      res.render('tecnica/obrasElectricas/emails/index', {
        emails,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (err) {
      console.error('Error al obtener emails:', err);
      res.status(500).send('Error del servidor');
    }
  },

  show: async (req, res) => {
    try {
      const email = await EmailModel.getEmailById(req.params.id);

      if (!email) {
        return res.status(404).send('Email no encontrado');
      }

      const solicitud = await EmailModel.getSolicitudById(email.solicitud_id); // Cambiar nombre del campo si es distinto
      email.solicitud = solicitud || null;

      res.render('tecnica/obrasElectricas/emails/show', { email });
    } catch (err) {
      console.error('Error al obtener email:', err);
      res.status(500).send('Error del servidor');
    }
  },
};
