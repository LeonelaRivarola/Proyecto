const express = require('express');
const router = express.Router()
const authController = require('../controllers/authController');
const solicitudController = require('../controllers/solicitudController');
const verificarToken = require('../middlewares/authMiddleware');
const tipoObraController = require('../controllers/tipoObraController');
// const presupuestoController = require('../controllers/presupuestoController');
const interferenciaController = require('../controllers/interferenciaController');

//
router.post('/login', authController.login);

//Solicitudes
router.get('/tecnica/obrasElectricas/solicitudes', verificarToken, solicitudController.index);
router.post('/tecnica/obrasElectricas/nueva-solicitud',verificarToken, solicitudController.store);
router.delete('/tecnica/obrasElectricas/eliminar/:id', verificarToken, solicitudController.destroy);

//Tipo de obras
router.get('/tecnica/obrasElectricas/tipoObras', verificarToken, tipoObraController.index);
router.post('/tecnica/obrasElectricas/nuevo-tipoObras', verificarToken, tipoObraController.store);
router.put('/tecnica/obrasElectricas/editar-tipoObras/:id', verificarToken, tipoObraController.update);
router.delete('/tecnica/obrasElectricas/eliminar-tipoObra/:id', verificarToken, tipoObraController.destroy);


// Presupuestos
// router.get('/tecnica/obrasElectricas/presupuestos', verificarToken, presupuestoController.index);
// router.get('/tecnica/obrasElectricas/presupuestos/crear/:solicitud', verificarToken, presupuestoController.create);
// router.post('/tecnica/obrasElectricas/presupuestos/guardar', verificarToken, presupuestoController.store);
// router.post('/tecnica/obrasElectricas/presupuestos/mostrar/:presupuesto', verificarToken, presupuestoController.show);
// router.get('/tecnica/obrasElectricas/presupuestos/documento/:solicitud', verificarToken, presupuestoController.abrirPresupuesto);
// router.post('/tecnica/obrasElectricas/presupuestos/actualizar/:solicitud', verificarToken, presupuestoController.update);
// router.post('/tecnica/obrasElectricas/presupuestos/notificar-email/:solicitud', verificarToken, presupuestoController.notificarEmail);

// // Route:: get('tecnica/obrasElectricas/presupuestos/crear/{solicitud}', [PresupuestoController:: class, 'create']) -> name('presupuestar-solicitud');
// // Route:: get('tecnica/obrasElectricas/presupuestos/documento/{solicitud}', [PresupuestoController:: class, 'abrirPresupuesto']) -> name('abrir-presupuesto');
// // Route:: post('tecnica/obrasElectricas/presupuestos/actualizar/{solicitud}', [PresupuestoController:: class, 'update']) -> name('procesar-presupuesto');
// // Route:: post('tecnica/obrasElectricas/solicitud/notificar-email/{solicitud}', [PresupuestoController:: class, 'notificarEmail']) -> name('notificar-presupuesto');

//controladores importados
// const dashboardController = require('../controllers/dashboardController');
// const registerController = require('../controllers/registerController');
// const sessionsController = require('../controllers/sessionsController');
// const solicitudController = require('../controllers/solicitudController');
// const presupuestoController = require('../controllers/presupuestoController');

//interferencias
router.get('/tecnica/obrasElectricas/interferencia', verificarToken, interferenciaController.index);
router.post('/tecnica/obrasElectricas/nueva-interferencia',verificarToken, interferenciaController.store);


// router.get('/', authMiddleware, dashboardController);
// router.get('sign-up', registerController.create);
// router.post('sign-up', registerController.store);
// router.get('sign-in', sessionsController.create);
// router.post('sign-in', sessionsController.store);
// // Route:: post('verify', [SessionsController:: class, 'show']) -> middleware('guest');
// router.post('sign-out', authMiddleware, sessionsController.destroy);
// // Route:: post('tecnica/obrasElectricas/solicitudes/path', [SolicitudController:: class, 'path']) -> name('path');

// // Solicitudes
// router.post('/tecnica/obrasElectricas/solicitudes/guardar', authMiddleware, solicitudController.store);
// router.get('/tecnica/obrasElectricas/solicitudes/mostrar/:solicitud', authMiddleware, solicitudController.show);
// router.delete('/tecnica/obrasElectricas/solicitudes/eliminar/:solicitud', authMiddleware, solicitudController.destroy);

// // Route:: get('tecnica/obrasElectricas/solicitudes/crear', [SolicitudController:: class, 'create']) -> name('nueva-solicitud');
// // Route:: get('tecnica/obrasElectricas/solicitudes/editar/{solicitud}', [SolicitudController:: class, 'edit']) -> name('editar-solicitud');
// // Route:: get('tecnica/obrasElectricas/solicitudes/acreditar/{solicitud}', [SolicitudController:: class, 'accredit']) -> name('acreditar-solicitud');
// // Route:: put('tecnica/obrasElectricas/solicitudes/actualizar/{solicitud}', [SolicitudController:: class, 'update']) -> name('actualizar-solicitud');
// // Route:: get('tecnica/obrasElectricas/solicitudes/documento/{solicitud}', [SolicitudController:: class, 'abrirSolicitud']) -> name('abrir-solicitud');
// // Route:: put('tecnica/obrasElectricas/solicitudes/cancelar/{solicitud}', [SolicitudController:: class, 'cancelar']) -> name('cancelar-solicitud');
// // Route:: put('tecnica/obrasElectricas/solicitudes/finalizar/{solicitud}', [SolicitudController:: class, 'finalizar']) -> name('finalizar-solicitud');

// // Presupuestos
// router.get('/tecnica/obrasElectricas/presupuestos', authMiddleware, presupuestoController.index);
// router.post('/tecnica/obrasElectricas/presupuestos/guardar', authMiddleware, presupuestoController.store);
// router.get('/tecnica/obrasElectricas/presupuestos/mostrar/:presupuesto', authMiddleware, presupuestoController.show);

// // Route:: get('tecnica/obrasElectricas/presupuestos/crear/{solicitud}', [PresupuestoController:: class, 'create']) -> name('presupuestar-solicitud');
// // Route:: get('tecnica/obrasElectricas/presupuestos/documento/{solicitud}', [PresupuestoController:: class, 'abrirPresupuesto']) -> name('abrir-presupuesto');
// // Route:: post('tecnica/obrasElectricas/presupuestos/actualizar/{solicitud}', [PresupuestoController:: class, 'update']) -> name('procesar-presupuesto');
// // Route:: post('tecnica/obrasElectricas/solicitud/notificar-email/{solicitud}', [PresupuestoController:: class, 'notificarEmail']) -> name('notificar-presupuesto');


// // // Observaciones
// // Route:: get('tecnica/ObrasElectricas/observaciones/crear/{solicitud}', [ObservacionController:: class, 'create']) -> name('observar-solicitud');
// // Route:: post('tecnica/ObrasElectricas/observaciones/guardar', [ObservacionController:: class, 'store']) -> name('crear-observacion');
// // // E-mail de Solicitudes
// // Route:: get('tecnica/obrasElectricas/emails', [EmailController:: class, 'index']) -> name('emails');
// // Route:: get('tecnica/obrasElectricas/emails/mostrar/{email}', [EmailController:: class, 'show']) -> name('mostrar-email');
// // // Tipo de Obra
// // Route:: get('tecnica/obrasElectricas/tiposDeObras', [TipoObraController:: class, 'index']) -> name('tipos-obras');
// // Route:: get('tecnica/obrasElectricas/tiposDeObras/editar/{tipoObra}', [TipoObraController:: class, 'edit']) -> name('editar-tipoObra');
// // Route:: put('tecnica/obrasElectricas/tiposDeObras/actualizar/{tipoObra}', [TipoObraController:: class, 'update']) -> name('actualizar-tipoObra');
// // Route:: get('tecnica/obrasElectricas/tiposDeObras/crear', [TipoObraController:: class, 'create']) -> name('crear-tipoObra');
// // Route:: post('tecnica/obrasElectricas/tiposDeObras/guardar', [TipoObraController:: class, 'store']) -> name('guardar-tipoObra');
// // Route:: delete ('tecnica/obrasElectricas/tiposDeObras/{tipoObra}', [TipoObraController:: class, 'destroy']) -> name('eliminar-tipoObra');
// // });
// // });





module.exports = router;