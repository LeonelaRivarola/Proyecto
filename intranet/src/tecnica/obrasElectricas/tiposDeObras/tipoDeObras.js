import React, { useEffect, useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';


const tipoDeObras = () => {
  const [tipoObras, setTipoObras] = useState([]);

  useEffect(() => {
    const fetchTiposOE = async () => {
      try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_URL}/api/tecnica/obrasElectricas/tipoObras`, {
          headers: {
            method: 'GET',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await respuesta.json();
        setTipoObras(data);
      } catch (err) {
        console.log(err);
      }
    }
  }, [])

  return (
    <Box sx={{ maxWidth: '900px', mx: 'auto', mt: 4 }}>
      {/* Encabezado verde */}
      <Paper
        elevation={4}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderRadius: 3,
          background: 'linear-gradient(90deg, #43a047, #66bb6a)',
          color: 'white',
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Listado
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#2e7d32',
            color: 'white',
            '&:hover': {
              backgroundColor: '#1b5e20',
            },
            borderRadius: 2,
            fontWeight: 'bold',
            textTransform: 'none',
          }}
        >
          NUEVO TIPO DE OBRA
        </Button>
      </Paper>

      {/* Tabla */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#5f6368' }}>ABREVIATURA</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#5f6368' }}>DESCRIPCIÓN</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#5f6368' }}>INTERNO</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#5f6368' }}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tipoObras.map((fila) => (
              <TableRow key={fila.id}>
                <TableCell>{fila.abreviatura}</TableCell>
                <TableCell>{fila.descripcion}</TableCell>
                <TableCell>{fila.interno}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small">Editar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default tipoDeObras
