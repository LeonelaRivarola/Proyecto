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
import CrearTipoOE from "./tecnica/obrasElectricas/tiposDeObras/CrearTipoOE";
import Interferencia from "./tecnica/interferencias/Interferencia";
import NuevaInterferencia from "./tecnica/interferencias/NuevaInterferencia";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta protegida */}
        <Route path="/home" element={<SesionProtegida> <Home /></SesionProtegida>}>
          <Route path="emails" element={<SesionProtegida> <EmailsTec /> </SesionProtegida>} />
          <Route path="presupuestos" element={<SesionProtegida> <Presupuestos /> </SesionProtegida>} />
          <Route path="solicitudes" element={<SesionProtegida> <Solicitudes /> </SesionProtegida>} />
          <Route path="tipos-obras" element={<SesionProtegida><TiposDeObras /></SesionProtegida>} />
          <Route path="editar/:id" element={<SesionProtegida><EditarTOE /></SesionProtegida>} />
          <Route path="nuevo" element={<SesionProtegida><CrearTipoOE /></SesionProtegida>} />
          <Route path="nueva-solicitud" element={<SesionProtegida> <NuevaSolicitud /> </SesionProtegida>} />
          <Route path="emails-solicitudes" element={<SesionProtegida> <EmailSolicitudes /> </SesionProtegida>} />
          <Route path="interferencias" element={<SesionProtegida> <Interferencia /> </SesionProtegida>} />
          <Route path="nueva-interferencia" element={<SesionProtegida> <NuevaInterferencia /> </SesionProtegida>} />
        </Route>
        <Route path="/" element={<Ingresar />}></Route>
      </Routes>
    </Router>
  )
}

export default App

