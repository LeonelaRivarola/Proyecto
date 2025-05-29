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
  Button,
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
    <Box sx={{ maxWidth: '1100px', overflowX: 'auto', mx: 'auto', mt: '1' }}>
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
          Listado de Solicitudes
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
          NUEVA SOLICITUD
        </Button>
      </Paper>

      <Box sx={{ maxWidth: '98%', mx: 'auto', overflowX: 'hidden', mt: 1 }}>
       <TableContainer component={Paper} elevation={2}>
        <Table size="small" sx={{ minWidth: '100%', tableLayout: 'fixed' }}>
          <TableHead sx={{ fontWeight: 'bold', color: '#5f6368' }}>
          <TableRow>
            {['NÚMERO', 'ESTADO', 'FECHA SOLICITUD', 'USUARIO', 'TIPO', 'DNI/CUIT', 'APELLIDO', 'NOMBRE', 'ACCIONES'].map(header => (
              <TableCell
                key={header}
                sx={{
                  maxWidth:
                    header === 'NÚMERO' ? 40 :
                    header === 'ESTADO' ? 60 :
                    header === 'FECHA SOLICITUD' ? 150 :
                    header === 'USUARIO' ? 150 :
                    header === 'TIPO' ? 140 :
                    header === 'DNI/CUIT' ? 110 :
                    header === 'APELLIDO' ? 110 :
                    header === 'NOMBRE' ? 110 :
                    header === 'ACCIONES' ? 90 : undefined,
                  padding: '6px 8px'
                }}
              >
                {header}
              </TableCell>
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
                          backgroundColor: '#000080',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#0a0a5c',
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
      </Box>
    </Box>
  );
};

export default Solicitudes;
