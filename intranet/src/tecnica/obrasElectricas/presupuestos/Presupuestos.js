import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
  Tooltip,
} from "@mui/material";
import { API_URL } from "../../../config";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Outlet } from "react-router-dom"; // Si usás rutas anidadas

const Presupuestos = () => {
  const [presupuestos, setPresupuestos] = useState([]);

  const fetchPresupuestos = async () => {
    try {
      const token = localStorage.getItem('token');
      const respuesta = await fetch(`${API_URL}/api/tecnica/obrasElectricas/presupuestos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await respuesta.json();
      if (Array.isArray(data)) {
        setPresupuestos(data);
      } else {
        console.error('La respuesta no es un array:', data);
        setPresupuestos([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPresupuestos();
  }, []);

  const mostrarPDF = async (usuario) => {
    try {
      const token = localStorage.getItem('token');
      const respuesta = await fetch(`${API_URL}/api/tecnica/obrasElectricas/getPresupuestoPath/${usuario}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await respuesta.json();
      console.log(data);

      if (data?.PSO_PATH) {
        const pdfURL = `${API_URL}/${data.PSO_PATH}`;
        window.open(pdfURL, '_blank'); 
      } else {
        console.error('No se encontró la ruta del PDF:', data);
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
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
          Listado de Presupuestos
        </Typography>
      </Paper>

      <Box sx={{ maxWidth: '100%', mx: 'auto', mt: 4 }}>
        <TableContainer component={Paper} elevation={2}>
          <Table size="small" sx={{ minWidth: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#C8E6C9' }}>APELLIDO</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#C8E6C9' }}>NOMBRE</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#C8E6C9' }}>PRESUPUESTO</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#C8E6C9' }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {presupuestos.map((fila) => (
                <TableRow key={fila.SOE_ID}>
                  <TableCell>{fila.SOE_APELLIDO}</TableCell>
                  <TableCell>{fila.SOE_NOMBRE}</TableCell>
                  <TableCell>{fila.SPR_PRESUPUESTO_ID?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <Tooltip title="Mostrar PDF">
                      <IconButton onClick={() => mostrarPDF(fila.SPR_USUARIO)} color="primary">
                        <PictureAsPdfIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Presupuestos;
