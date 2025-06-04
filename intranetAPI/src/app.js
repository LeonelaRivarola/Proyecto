const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',  // o '*' para permitir todos (no recomendado en producción)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true // si usas cookies o autenticación basada en sesión
}));
app.use(express.json());
app.use('/api', authRoutes);

const PORT = 18001;
const HOST = "172.16.14.210"; //26 es la otra pc


