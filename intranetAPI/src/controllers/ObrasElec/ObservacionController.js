const moment = require('moment');
const Solicitud = require('../models/Solicitud');
const Observacion = require('../models/Observacion');
const SolicitudObservacion = require('../models/SolicitudObservacion');
const emailService = require('../services/emailService'); // asumimos que lo tenés implementado
const auth = require('../middleware/auth'); // middleware para obtener usuario logueado

class ObservacionController {

  // GET /observaciones/create/:soe_id
  static async create(req, res) {
    try {
      const soe_id = req.params.soe_id;
      // Cargo la solicitud con relaciones (deberías implementar estas funciones en modelo Solicitud)
      const solicitud = await Solicitud.findByIdWithRelations(soe_id, ['tipos', 'localidad']);
      if (!solicitud) {
        return res.status(404).send('Solicitud no encontrada');
      }
      // Renderizar vista (si usás template engine)
      return res.render('tecnica/obrasElectricas/observaciones/create', { solicitud });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error en el servidor');
    }
  }

  // POST /observaciones
  static async store(req, res) {
    try {
      const { soe_id, observacion, emailNotificar } = req.body;
      const usuario = req.user.USU_CODIGO.trim(); // Middleware auth debería setear req.user

      // Obtener solicitud con ultimoEstado
      const solicitud = await Solicitud.findByIdWithUltimoEstado(soe_id);
      if (!solicitud) {
        return res.status(404).send('Solicitud no encontrada');
      }

      // Crear observacion
      const nuevaObservacion = await Observacion.create({ OSO_DESCRIPCION: observacion });

      // Actualizar solicitud
      await Solicitud.update(soe_id, {
        SOE_USUARIO: usuario,
        SOE_UPDATE: moment().toDate(),
      });

      // Crear solicitudObservacion
      await SolicitudObservacion.create({
        SOB_SES_ID: solicitud.ultimoEstado.SES_ID,
        SOB_OBSERVACION_ID: nuevaObservacion.OSO_ID,
        SOB_USUARIO: usuario,
        SOB_FECHA: moment().toDate(),
      });

      // Enviar email si aplica
      if (emailNotificar) {
        await emailService.enviarEmail(req.body, solicitud);
      }

      return res.redirect('/solicitudes?status=Solicitud Observada correctamente.');
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error en el servidor');
    }
  }
}

module.exports = ObservacionController;
