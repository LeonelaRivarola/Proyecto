//Se podran ver las interferenciascon el boton de eliminar interferencia y otro para asignar?

import React, { useEffect, useState } from 'react';
import {
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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip
} from '@mui/material';

import { UploadFile, Delete } from '@mui/icons-material';
// import UploadFileIcon from '@mui/icons-material/UploadFile';
import { API_URL } from '../../../config';
import { useNavigate } from 'react-router-dom';
import ModalEliminarSolicitud from '../../../componentes/modales/ModalEliminarSolicitud.js';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';

const Interferencias = () => {
  const [interferencias, setInterferencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [error, setError] = useState(false);
  const [interferenciaAeliminar, setInterferenciaAeliminar] = useState([null]);
  const [modalOpen, setModalOpen] = useState(false);
  const [mensajeVisible, setMensajeVisible] = useState(false);
  const [mensajeTexto, setMensajeTexto] = useState('');
  const navigate = useNavigate();

  const handleDocumentar = (id) => {
    console.log("Asignar interferencia:", id);
  };

  const handlePresupuestar = (id) => {
    console.log("Presupuestar solicitud:", id);
  };

  const handleEliminar = (id_interf) => {
    setInterferenciaAeliminar(id_interf);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/api/tecnica/interferencia/eliminar-interf/${interferenciaAeliminar.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setMensajeTexto(`Se ha eliminado exitosamente la solicitud ${interferenciaAeliminar.id}`);
      setMensajeVisible(true);

      setTimeout(() => {
        setMensajeVisible(false);
      }, 4000);

      await fetchInterferencia();

    } catch (error) {
      console.error('Error eliminando la interferencia:', error);
    } finally {
      setModalOpen(false);
    }
  };

  const fetchInterferencia = async () => {
    try {
      const token = localStorage.getItem('token');
      const respuesta = await fetch(`${API_URL}/api/tecnica/interferencias/listado`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await respuesta.json();
   } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterferencia();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <FormControl variant="outlined" size="small" sx={{ minWidth: 200, mb: 2 }}>
        <InputLabel id="estado-label">Filtrar por Estado</InputLabel>
        <Select
          labelId="estado-label"
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          label="Filtrar por Estado"
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="Cerrada">Cerrada</MenuItem>
          <MenuItem value="Iniciada">Iniciada</MenuItem>
          <MenuItem value="Pendiente">Pendiente</MenuItem>
          <MenuItem value="Asignada">Asignada</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ height: '10px' }} />

      {mensajeVisible && (
        <Alert
          severity="success"
          sx={{
            mb: 2,
            borderRadius: 2,
            backgroundColor: '#d0f0c0',
            color: '#1b5e20',
            fontWeight: 'bold'
          }}
        >
          {mensajeTexto}
        </Alert>
      )}

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
          Listado de Interferencias
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
          onClick={() => navigate('/home/nueva-solicitud')}
        >
          NUEVA INTERFERENCIA
        </Button>
      </Paper>

      <Box sx={{ maxWidth: '100%', mx: 'auto', mt: 4 }}>
        <TableContainer component={Paper} elevation={2} sx={{ overflow: 'hidden' }}>
          <Table size="small" sx={{ minWidth: '100%', tableLayout: 'auto' }}>
            <TableHead>
              <TableRow>
                {['ID', 'ESTADO', 'FECHA SOLICITUD', 'USUARIO', 'TIPO', 'DNI/CUIT', 'APELLIDO', 'NOMBRE', 'ACCIONES'].map(header => (
                  <TableCell
                    key={header}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontWeight: 'bold',
                      backgroundColor: '#C8E6C9',
                      maxWidth:
                        header === 'NÚMERO' ? 70 :
                          header === 'ESTADO' ? 80 :
                            header === 'FECHA SOLICITUD' ? 130 :
                              header === 'USUARIO' ? 140 :
                                header === 'TIPO' ? 120 :
                                  header === 'DNI/CUIT' ? 110 :
                                    header === 'APELLIDO' ? 110 :
                                      header === 'NOMBRE' ? 110 :
                                        header === 'ACCIONES' ? 90 : undefined,
                      padding: '6px 8px'
                    }}
                  >
                    <Typography variant="body2" noWrap title={header} sx={{ fontWeight: 'bold', color: '#5f6368' }}>
                      {header}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <Box sx={{ height: '12px' }} />
            
            <TableBody>
              {interferencias
                .filter(s => estadoFiltro === '' || s.Estado === estadoFiltro)
                .map((interferencia) => (
                  <TableRow key={interferencia.id} hover>
                    <TableCell>{interferencia.estado}</TableCell>
                    <TableCell>{interferencia.fecha}</TableCell>
                    <TableCell>{interferencia.Usuario}</TableCell>
                    {/* <TableCell>{solicitud.Tipo}</TableCell>
                    <TableCell>{solicitud.DNI_CUIT}</TableCell>
                    <TableCell>{solicitud.Apellido}</TableCell>
                    <TableCell>{solicitud.Nombre}</TableCell> */}
                    <TableCell>
                      <Box display="flex" gap={2}>
                        {solicitud.Estado === 'Pendiente' ? (
                          <Box display="flex" gap={1.5}>
                            <Tooltip title="Presupuestar Documento" arrow>
                              <IconButton
                                onClick={() => handlePresupuestar(solicitud.Número)}
                                size="small"
                                sx={{
                                  backgroundColor: '#000080',
                                  color: 'white',
                                  '&:hover': {
                                    backgroundColor: '#0a0a5c',
                                  },
                                  borderRadius: 2,
                                  padding: '4px'
                                }}
                              >
                                <UploadFileIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancelar y Eliminar Solicitud" arrow>
                              <IconButton
                                color="error"
                                onClick={() => handleEliminar(solicitud)}
                                size="small"
                                sx={{
                                  backgroundColor: '#FFA500',
                                  color: 'white',
                                  '&:hover': {
                                    backgroundColor: '#CC8400',
                                  },
                                  borderRadius: 2,
                                  padding: '4px'
                                }}
                              >
                                <DoDisturbAltIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : solicitud.Estado === 'Iniciada' ? (
                          <Box display="flex" gap={1.5}>
                            <Tooltip title="Documentar Solicitud" arrow>
                              <IconButton
                                onClick={() => handleDocumentar(solicitud.Número)}
                                size="small"
                                sx={{
                                  backgroundColor: '#000080',
                                  color: 'white',
                                  '&:hover': {
                                    backgroundColor: '#0a0a5c',
                                  },
                                  borderRadius: 2,
                                  padding: '4px'
                                }}
                              >
                                <UploadFile fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar Solicitud" arrow>
                              <IconButton
                                color="error"
                                onClick={() => handleEliminar(solicitud)}
                                size="small"
                                sx={{
                                  backgroundColor: '#d32f2f',
                                  color: 'white',
                                  '&:hover': {
                                    backgroundColor: '#b71c1c',
                                  },
                                  borderRadius: 2,
                                  padding: '4px'
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : null}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <ModalEliminarSolicitud
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={solicitudE.Nombre}
      />
    </Box>
  );
};

export default Interferencias;