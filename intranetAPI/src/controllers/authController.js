// const bcrypt = require('bcrypt'); // asegurate de instalarlo
const { findUserByUsername } = require('../models/userModel');
const { connectToGeaSeguridad, sql } = require('../config/db');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(400).json({error: 'Faltan datos'});
    }

    try {
        const pool = await connectToGeaSeguridad();
        const result = await pool.request()
        .input('username',sql.VarChar, username)
        .query('SELECT USU_CODIGO, USU_PASSWORD FROM dbo.USUARIOS WHERE USU_CODIGO = @username');

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const user = result.recordset[0];
        // si las contraseñas está en texto plano (me parece)
        if(user.USU_PASSWORD.trim() !== password){
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }
        
         // Login exitoso (podría crear un token JWT)
    return res.json({ message: 'Login exitoso', user: { username: user.USU_CODIGO.trim() } });

        // const passwordValid = await bcrypt.compare(password, user.USU_PASSWORD);
        // if (!passwordValid) {
        //     return res.status(401).json({ error: 'Contraseña incorrecta' });
        // }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el login', details: err.message });
    }
};

