const express = require('express');
const { connectToGeaCorpico,
    connectToGeaSeguridad,
    connectToAlum,
    sql } = require('./config/db.js');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());
app.use('/api', authRoutes);

const PORT = 18001;
const HOST = "172.16.14.210"; //26 es la otra pc


//Pueba
connectToGeaSeguridad().then(pool => {
    app.get('/', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT TOP 5 USU_CODIGO, USU_PASSWORD FROM USUARIOS');
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Error consultando la base de datos' });
        }
    });

    app.listen(PORT, HOST, () => {
        console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
    });
}).catch(err => {
    console.error('No se pudo conectar a la BD:', err);
});