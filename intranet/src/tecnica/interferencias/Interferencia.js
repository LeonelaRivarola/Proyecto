// src/tecnica/interferencia/Interferencias.js

import React from 'react';

const Interferencias = () => {

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
          {/* {interferencias.map((item) => (
            <tr key={item.id}>
            <td style={tdStyle}>{item.solicitud}</td>
            <td style={tdStyle}>{item.empresaPersona}</td>
            <td style={tdStyle}>{item.direccion}</td>
            <td style={tdStyle}>{item.estado}</td>
            <td style={tdStyle}>{item.fechaSolicitud}</td>
            <td style={tdStyle}>{item.fechaInicio}</td>
            <td style={tdStyle}>{item.fechaFin}</td>
            <td style={tdStyle}>{item.localidad}</td> 
          </tr>
          ))}*/}
        </tbody>
      </table>
    </div>
  );
};

export default Interferencias;