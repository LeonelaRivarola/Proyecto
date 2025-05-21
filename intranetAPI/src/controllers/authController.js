// const bcrypt = require('bcrypt'); // asegurate de instalarlo
const { findUserByUsername } = require('../models/userModel');
const { connectToGeaSeguridad, sql } = require('../config/db');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'Co23pi08cO';

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        const pool = await connectToGeaSeguridad();
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT USU_CODIGO, USU_PASSWORD FROM dbo.USUARIOS WHERE USU_CODIGO = @username');

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const user = result.recordset[0];
        // si las contraseñas está en texto plano (me parece)
        if (user && user.USU_PASSWORD.trim() === password) {
            const token = jwt.sign(
                {
                    username: user.USU_CODIGO
                },
                SECRET_KEY,
                { expresIn: '1h' }
            );
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Login exitoso (podría crear un token JWT)

        // const passwordValid = await bcrypt.compare(password, user.USU_PASSWORD);
        // if (!passwordValid) {
        //     return res.status(401).json({ error: 'Contraseña incorrecta' });
        // }

    } catch (err) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

