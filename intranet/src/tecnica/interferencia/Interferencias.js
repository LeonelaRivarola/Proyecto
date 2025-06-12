// src/tecnica/interferencia/Interferencias.js

import React from 'react';

const Interferencias = () => {
  // // Datos de ejemplo
  // const interferencias = [
  //   { id: 1, nombre: "Interferencia en línea 123", estado: "Pendiente" },
  //   { id: 2, nombre: "Cruce con cableado externo", estado: "Resuelta" },
  //   { id: 3, nombre: "Poste mal ubicado", estado: "En análisis" },
  // ];

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
            {/* <th style={thStyle}>Tipo</th> */} {/* no lo pidieron pero me parece que hay que tener consideracion */}
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
