// src/tecnica/interferencia/Interferencias.js

import React from 'react';

const Interferencias = () => {
  // Datos de ejemplo
  const interferencias = [
    { id: 1, nombre: "Interferencia en línea 123", estado: "Pendiente" },
    { id: 2, nombre: "Cruce con cableado externo", estado: "Resuelta" },
    { id: 3, nombre: "Poste mal ubicado", estado: "En análisis" },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Listado de Interferencias</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Descripción</th>
            <th style={thStyle}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {interferencias.map((item) => (
            <tr key={item.id}>
              <td style={tdStyle}>{item.id}</td>
              <td style={tdStyle}>{item.nombre}</td>
              <td style={tdStyle}>{item.estado}</td>
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
