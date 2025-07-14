// const bcrypt = require('bcrypt');
const { connectToGeaSeguridad, sql } = require('../config/db');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'Co23pi08cO';

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const pool = await connectToGeaSeguridad();
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT USU_CODIGO, USU_PASSWORD FROM dbo.USUARIOS WHERE USU_CODIGO = @username');

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const user = result.recordset[0];
        console.log('Password desde la BD:', user.USU_PASSWORD);
        console.log('Password enviado:', password);

        // si las contraseñas está en texto plano (me parece)
        if (user.USU_PASSWORD.trim() === password) {
            const token = jwt.sign(
                {
                    username: user.USU_CODIGO
                },
                SECRET_KEY,
                { expiresIn: '1h' }
            );
            return res.json({ token, username: user.USU_CODIGO }); 
        } else {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        //contraseña hasheada
        // const passwHash = user.USU_PASSWORD;
        // console.log('Hash recuperado de BD:', passwHash);

        // const passwordValida = await bcrypt.compare(password, passwHash);

        // if (!passwordValida) {
        //     return res.status(401).json({ message: "Contraseña incorrecta" });
        // }

        // const token = jwt.sign({ username: user.USU_CODIGO },
        //     SECRET_KEY,
        //     { expiresIn: '1h' });

        // return res.json({ token });

    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
