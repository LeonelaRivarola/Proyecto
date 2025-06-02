import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Ingresar from "./sesion/Ingresar";
import Home from './tecnica/obrasElectricas/Home'
import EmailsTec from './tecnica/obrasElectricas/emails/EmailSolicitudes'
import Presupuestos from './tecnica/obrasElectricas/presupuestos/Presupuestos'
import Solicitudes from './tecnica/obrasElectricas/solicitudes/Solicitudes'
import TiposDeObras from "./tecnica/obrasElectricas/tiposDeObras/TiposDeObras";
import NuevaSolicitud from "./tecnica/obrasElectricas/nuevaSolicitud/NuevaSolicitud";
import EmailSolicitudes from "./tecnica/obrasElectricas/emails/EmailSolicitudes";
import SesionProtegida from "./sesion/SesionProtegida";
import EditarTOE from "./tecnica/obrasElectricas/tiposDeObras/EditarTOE";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas protegidas como rutas independientes */}
        <Route path="/home" element={<SesionProtegida><Home /></SesionProtegida>} />
        <Route path="/home/emails" element={<SesionProtegida><EmailsTec /></SesionProtegida>} />
        <Route path="/home/presupuestos" element={<SesionProtegida><Presupuestos /></SesionProtegida>} />
        <Route path="/home/solicitudes" element={<SesionProtegida><Solicitudes /></SesionProtegida>} />
        <Route path="/home/tipos-obras" element={<SesionProtegida><TiposDeObras /></SesionProtegida>} />
        <Route path="/home/editar-tipoOE/:id" element={<SesionProtegida><EditarTOE /></SesionProtegida>} />
        <Route path="/home/nueva-solicitud" element={<SesionProtegida><NuevaSolicitud /></SesionProtegida>} />
        <Route path="/home/emails-solicitudes" element={<SesionProtegida><EmailSolicitudes /></SesionProtegida>} />
        {/* Ruta pública */}
        <Route path="/" element={<Ingresar />} />
      </Routes>
    </Router>
  )
}

export default App

