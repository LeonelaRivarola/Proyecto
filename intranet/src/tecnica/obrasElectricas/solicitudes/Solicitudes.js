import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Box,
} from '@mui/material';
import { UploadFile, Delete } from '@mui/icons-material';
import { API_URL } from '../../../config';

const Solicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [error, setError] = useState(null);

  const handleDocumentar = (id) => {
    console.log("Documentar solicitud:", id);
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Estás seguro que querés eliminar esta solicitud?")) {
      console.log("Eliminar solicitud:", id);
    }
  };

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_URL}/api/tecnica/obrasElectricas/solicitudes`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await respuesta.json();
        setSolicitudes(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>¡Error al cargar los datos!</Typography>
          <Typography>{error.message}</Typography>
          <Typography variant="body2" mt={2}>Por favor, intente más tarde o contacte soporte.</Typography>
        </Alert>
      </Container>
    );
  }

  if (!solicitudes || solicitudes.length === 0) {
    return (
      <Container maxWidth="md">
        <Alert severity="info">
          No hay solicitudes para mostrar en este momento.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          background: 'linear-gradient(to right, #4caf50, #81c784)',
          p: 3,
          borderRadius: 4,
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="white">
          Solicitudes
        </Typography>
      </Box>

      <Box display="flex" justifyContent="left" mb={4}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="estado-label">Estado</InputLabel>
          <Select
            labelId="estado-label"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            label="Estado"
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Aceptada">Aceptada</MenuItem>
            <MenuItem value="Actualizar">Actualizar</MenuItem>
            <MenuItem value="Cerrada">Cerrada</MenuItem>
            <MenuItem value="Iniciada">Iniciada</MenuItem>
            <MenuItem value="Pendiente">Pendiente</MenuItem>
            <MenuItem value="Presupuestada">Presupuestada</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 5, minWidth: 1200 }}>
        <Table>
          <TableHead sx={{ background: 'linear-gradient(to right, #388e3c, #66bb6a)' }}>
            <TableRow>
              {['NÚMERO', 'ESTADO', 'FECHA SOLICITUD', 'USUARIO', 'TIPO', 'DNI/CUIT', 'APELLIDO', 'NOMBRE', 'ACCIONES'].map(header => (
                <TableCell key={header} sx={{ color: 'white', fontWeight: 'bold' }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitudes
              .filter(s => estadoFiltro === '' || s.Estado === estadoFiltro)
              .map((solicitud) => (
                <TableRow key={solicitud.id} hover>
                  <TableCell>{solicitud.Número}</TableCell>
                  <TableCell>{solicitud.Estado}</TableCell>
                  <TableCell>{solicitud.Fecha_Solicitud}</TableCell>
                  <TableCell>{solicitud.Usuario}</TableCell>
                  <TableCell>{solicitud.Tipo}</TableCell>
                  <TableCell>{solicitud.DNI_CUIT}</TableCell>
                  <TableCell>{solicitud.Apellido}</TableCell>
                  <TableCell>{solicitud.Nombre}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton onClick={() => handleDocumentar(solicitud.Número)}
                        sx={{
                          backgroundColor: '#388e3c',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#2e7d32',
                          },
                          borderRadius: 3
                        }}>
                        <UploadFile />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleEliminar(solicitud.Número)}
                        sx={{
                          backgroundColor: '#d32f2f',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#b71c1c',
                          },
                          borderRadius: 3
                        }}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Solicitudes;
