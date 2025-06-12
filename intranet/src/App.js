import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Ingresar from "./sesion/Ingresar";
import Home from './tecnica/obrasElectricas/Home';
import EmailSolicitudes from './tecnica/obrasElectricas/emails/EmailSolicitudes';
import Presupuestos from './tecnica/obrasElectricas/presupuestos/Presupuestos';
import Solicitudes from './tecnica/obrasElectricas/solicitudes/Solicitudes';
import TiposDeObras from "./tecnica/obrasElectricas/tiposDeObras/TiposDeObras";
import NuevaSolicitud from "./tecnica/obrasElectricas/nuevaSolicitud/NuevaSolicitud";
import EditarTOE from "./tecnica/obrasElectricas/tiposDeObras/EditarTOE";
import Interferencias from "./tecnica/interferencia/Interferencias";
import NuevaInterferencia from "./tecnica/interferencia/nuevaInterferencia";
import SesionProtegida from "./sesion/SesionProtegida";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Ingresar />} />
        <Route path="/Home" element={<SesionProtegida><Home /></SesionProtegida>}>
          <Route path="emails" element={<EmailSolicitudes />} />
          <Route path="presupuestos" element={<Presupuestos />} />
          <Route path="solicitudes" element={<Solicitudes />} />
          <Route path="tipos-obras" element={<TiposDeObras />} />
          <Route path="editar/:id" element={<EditarTOE />} />
          <Route path="nueva-solicitud" element={<NuevaSolicitud />} />
          <Route path="emails-solicitudes" element={<EmailSolicitudes />} />
          <Route path="interferencias" element={<Interferencias />} />
          <Route path="interferencias/nueva" element={<NuevaInterferencia />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
