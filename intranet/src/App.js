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
import Observaciones from './tecnica/obrasElectricas/observaciones/Observaciones'
import Presupuestos from './tecnica/obrasElectricas/presupuestos/Presupuestos'
import Solicitudes from './tecnica/obrasElectricas/solicitudes/Solicitudes'
import TiposDeObra from './tecnica/obrasElectricas/tiposDeObras/tipoDeObras'
import NuevaSolicitud from "./tecnica/obrasElectricas/nuevaSolicitud/NuevaSolicitud";
import EmailSolicitudes from "./tecnica/obrasElectricas/emails/EmailSolicitudes";
import SesionProtegida from "./sesion/SesionProtegida";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta protegida */}
        <Route path="/home" element={
          <SesionProtegida>
            <Home />
          </SesionProtegida>
        }>
          <Route path="emails" element={<EmailsTec />}></Route>
          <Route path="presupuestos" element={<Presupuestos />}></Route>
          <Route path="solicitudes" element={<Solicitudes />}></Route>
          <Route path="tipos-obras" element={<TiposDeObra />}></Route>
          <Route path="nueva-solicitud" element={<NuevaSolicitud />}></Route>
          <Route path="emails-solicitudes" element={<EmailSolicitudes />}></Route>
        </Route>
        <Route path="/" element={<Ingresar />}></Route>
      </Routes>
    </Router>
  )
}

export default App

