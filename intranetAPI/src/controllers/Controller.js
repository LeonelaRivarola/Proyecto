class Controller {
  // Método para enviar respuestas exitosas
  sendSuccess(res, data = {}, message = 'OK') {
    return res.json({
      success: true,
      message,
      data,
    });
  }

  // Método para enviar respuestas con error
  sendError(res, error, status = 500) {
    const message = error.message || 'Error interno del servidor';
    return res.status(status).json({
      success: false,
      message,
    });
  }

  // Validación simple usando un esquema Joi (o cualquier validador que uses)
  validate(schema, reqBody) {
    const { error } = schema.validate(reqBody);
    if (error) throw new Error(error.details[0].message);
  }

  // Middleware para autorización (ejemplo simple, podés mejorar según tus reglas)
  authorize(user, roles = []) {
    if (!user) throw new Error('No autorizado');
    if (roles.length && !roles.includes(user.role)) {
      throw new Error('Permiso denegado');
    }
  }
}

module.exports = Controller;
