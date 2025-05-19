import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Ingresar from "./sesion/Ingresar";
import Home from './tecnica/obrasElectricas/Home'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/Home" element={<Home />}></Route>
        <Route path="/" element={<Ingresar />}></Route>
      </Routes>
    </Router>
  )
}

export default App

