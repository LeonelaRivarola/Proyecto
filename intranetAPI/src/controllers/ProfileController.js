const Usuario = require('../models/User'); // o UsuarioCorpico si seguís usando ese modelo

class ProfileController {
  // Mostrar perfil (si lo necesitás)
  static async getProfile(req, res) {
    try {
      const user = req.user;
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener perfil' });
    }
  }

  // Actualizar perfil
  static async update(req, res) {
    try {
      const user = req.user; // Asumimos que lo tenés cargado por middleware auth
      const { email, name, phone, about, location } = req.body;

      // Validaciones manuales
      if (!email || !name || !phone || !about || !location) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
      }

      if (!email.includes('@')) {
        return res.status(400).json({ success: false, message: 'Email no válido' });
      }

      if (phone.length > 10) {
        return res.status(400).json({ success: false, message: 'Teléfono demasiado largo' });
      }

      if (about.length > 150) {
        return res.status(400).json({ success: false, message: 'Descripción demasiado larga' });
      }

      // Validar que el email no esté en uso por otro
      const existingUser = await Usuario.findByEmail(email);
      if (existingUser && existingUser.USU_CODIGO !== user.USU_CODIGO) {
        return res.status(400).json({ success: false, message: 'El email ya está en uso' });
      }

      // Actualizar usuario
      await Usuario.update(user.USU_CODIGO, { email, name, phone, about, location });

      return res.json({ success: true, message: 'Perfil actualizado correctamente' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  }
}

module.exports = ProfileController;
