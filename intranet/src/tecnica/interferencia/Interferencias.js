// src/tecnica/interferencia/Interferencias.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { Box, CircularProgress} from '@mui/material';


const Interferencias = () => {
  const [interferencias, setInterferencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  useEffect(() => {
    fetchInterferencias();
  }, [])

  const fetchInterferencias = async () => {
    try {
      const token = localStorage.getItem('token');
      const respuesta = await fetch(`${API_URL}/api/tecnica/interferencia/Interferencias`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await respuesta.json();
      setInterferencias(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const formatDate = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString(); // o date.toISOString().slice(0,10)
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Listado de Interferencias</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Solicitud</th>
            <th style={thStyle}>Empresa / Particula</th> {/*aca va el nombre sea de la empresa o persona*/}
            <th style={thStyle}>Direccion</th> {/*tratar que este aca adentro calle nro dpto entre1 y entre2 */}
            <th style={thStyle}>Estado</th> {/*pendiente, asignado, en proceso, cancelado */}
            <th style={thStyle}>Fecha de solicitud</th> {/*dia en el que se solicito la interferencia */}
            <th style={thStyle}>Fecha de inicio</th> {/*fehca de  cuanto duraria la obra desde hasta cuando */}
            <th style={thStyle}>Fecha de fin</th>
            <th style={thStyle}>Localidad</th>
          </tr>
        </thead>
        <tbody>
          {interferencias.map((item) => (
            <tr key={item.ID}>
              <td style={tdStyle}>{item.ID}</td>
              <td style={tdStyle}>{item.Nombre} {item.Apellido}</td>
              <td style={tdStyle}>{item.Calle} {item.Altura}, {item.Piso ? `Piso ${item.Piso}` : ''} {item.Dpto ? `Dpto ${item.Dpto}` : ''}, entre {item.Entre1} y {item.Entre2}</td>
              <td style={tdStyle}>Pendiente</td> {/* Cambiar por campo real si lo tenés */}
              <td style={tdStyle}>{formatDate(item.Fecha_interf)}</td>
              <td style={tdStyle}>{formatDate(item.Desde)}</td>
              <td style={tdStyle}>{formatDate(item.Hasta)}</td>
              <td style={tdStyle}>{item.Localidad}</td> {/* Idealmente buscar el nombre de la localidad */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



// Estilos simples para tabla
const thStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  backgroundColor: '#f2f2f2',
  textAlign: 'left'
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '10px'
};

export default Interferencias;
