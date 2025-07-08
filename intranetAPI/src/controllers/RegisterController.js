const bcrypt = require('bcrypt');
const User = require('../models/User'); // o UsuarioCorpico

class RegisterController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validaciones básicas
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
      }

      // ¿Email ya registrado?
      const existing = await User.findByEmail(email);
      if (existing) {
        return res.status(400).json({ message: 'El email ya está en uso' });
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      const newUser = await User.create({ name, email, password: hashedPassword });

      // Opción: generar token JWT o dejar que frontend lo maneje
      return res.status(201).json({ message: 'Usuario creado correctamente', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al registrar usuario' });
    }
  }
}

module.exports = RegisterController;
