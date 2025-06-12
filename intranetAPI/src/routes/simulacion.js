const express = require('express');
const router = express.Router();

// Simulación de datos
const interferenciasFake = [
  {
    ID: 1,
    CUIT_DNI: '20-12345678-9',
    Nombre: 'Juan',
    Apellido: 'Pérez',
    Es_persona: true,
    Email: 'juanperez@mail.com',
    Calle: 'Av. Siempre Viva',
    Altura: '742',
    Piso: '1',
    Dpto: 'A',
    Vereda: 'Norte',
    Entre1: 'Calle A',
    Entre2: 'Calle B',
    ID_Localidad: 'General Pico',
    Latitud: -35.658,
    Longitud: -63.753,
    Desde: '2024-07-01',
    Hasta: '2024-07-15',
    Fecha_interf: '2024-06-25',
    Mapa: '',
    Path: ''
  },
  {
    ID: 2,
    CUIT_DNI: '23-87654321-0',
    Nombre: 'Empresa XYZ',
    Apellido: '',
    Es_persona: false,
    Email: 'contacto@xyz.com',
    Calle: 'Calle Falsa',
    Altura: '123',
    Piso: '',
    Dpto: '',
    Vereda: 'Sur',
    Entre1: 'Calle C',
    Entre2: 'Calle D',
    ID_Localidad: 'Santa Rosa',
    Latitud: -36.6167,
    Longitud: -64.2833,
    Desde: '2024-08-01',
    Hasta: '2024-08-10',
    Fecha_interf: '2024-07-15',
    Mapa: '',
    Path: ''
  }
];

router.get('/tecnica/obrasElectricas/solicitudes', (req, res) => {
  res.json(interferenciasFake);
});

module.exports = router;
