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
        {/* Ruta protegida */}
        <Route path="/home" element={<SesionProtegida><Home /></SesionProtegida>}>
          <Route path="emails" element={<EmailsTec />} />
          <Route path="presupuestos" element={<Presupuestos />} />
          <Route path="solicitudes" element={<Solicitudes />} />
          <Route path="tipos-obras" element={<TiposDeObras />}>
            <Route path="editar-tipoOE/:id" element={<EditarTOE />} />
          </Route>
          <Route path="nueva-solicitud" element={<NuevaSolicitud />} />
          <Route path="emails-solicitudes" element={<EmailSolicitudes />} />
        </Route>
        <Route path="/" element={<Ingresar />}></Route>
      </Routes>
    </Router>
  )
}

export default App

