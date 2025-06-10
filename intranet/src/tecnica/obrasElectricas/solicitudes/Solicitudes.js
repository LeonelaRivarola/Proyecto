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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip
} from '@mui/material';

import { UploadFile, Delete } from '@mui/icons-material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { API_URL } from '../../../config';
import { Navigate, useNavigate } from 'react-router-dom';
import ModalEliminarSolicitud from '../../../componentes/modales/ModalEliminarSolicitud.js';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const Solicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [error, setError] = useState(false);
  const [solicitudE, setSolicitudE] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [mensajeVisible, setMensajeVisible] = useState(false);
  const [mensajeTexto, setMensajeTexto] = useState('');
  const navigate = useNavigate();

  const handleDocumentar = (id) => {
    console.log("Documentar solicitud:", id);
  };

  const handlePresupuestar = (id) => {
    console.log("Presupuestar solicitud:", id);
  };

  const handleEliminar = (id) => {
    setSolicitudE(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/api/tecnica/obrasElectricas/eliminar/${solicitudE.Número}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setMensajeTexto(`Se ha eliminado exitosamente la solicitud ${solicitudE.Número}`);
      setMensajeVisible(true);

      setTimeout(() => {
        setMensajeVisible(false);
      }, 4000);

      await fetchSolicitudes();

    } catch (error) {
      console.error('Error eliminando la solicitud:', error);
    } finally {
      setModalOpen(false);
    }
  };

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

  useEffect(() => {
    fetchSolicitudes();
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
          <MenuItem value="Aceptada">Aceptada</MenuItem>
          <MenuItem value="Actualizar">Actualizar</MenuItem>
          <MenuItem value="Cerrada">Cerrada</MenuItem>
          <MenuItem value="Iniciada">Iniciada</MenuItem>
          <MenuItem value="Pendiente">Pendiente</MenuItem>
          <MenuItem value="Presupuestada">Presupuestada</MenuItem>
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
          onClick={() => navigate('/home/nueva-solicitud')}
        >
          NUEVA SOLICITUD
        </Button>
      </Paper>

      <Box sx={{ maxWidth: '100%', mx: 'auto', mt: 4 }}>
        <TableContainer component={Paper} elevation={2} sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: '100%', tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                {['NÚMERO', 'ESTADO', 'FECHA SOLICITUD', 'USUARIO', 'TIPO', 'DNI/CUIT', 'APELLIDO', 'NOMBRE', 'ACCIONES'].map(header => (
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
                                        header === 'ACCIONES' ? 120 : undefined,
                      padding: '6px 8px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <Typography variant="body2" noWrap title={header} sx={{ fontWeight: 'bold', color: '#5f6368' }}>
                      {header}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {solicitudes
                .filter(s => estadoFiltro === '' || s.Estado === estadoFiltro)
                .map((solicitud) => (
                  <TableRow key={solicitud.id} hover>
                    <TableCell sx={{ maxWidth: 70 }}>{solicitud.Número}</TableCell>
                    <TableCell sx={{ maxWidth: 80 }}>{solicitud.Estado}</TableCell>
                    <TableCell sx={{ maxWidth: 130 }}>{solicitud.Fecha_Solicitud}</TableCell>
                    <TableCell sx={{ maxWidth: 140 }}>{solicitud.Usuario}</TableCell>
                    <TableCell sx={{ maxWidth: 120 }}>{solicitud.Tipo}</TableCell>
                    <TableCell sx={{ maxWidth: 110 }}>{solicitud.DNI_CUIT}</TableCell>
                    <TableCell sx={{ maxWidth: 110 }}>{solicitud.Apellido}</TableCell>
                    <TableCell sx={{ maxWidth: 110 }}>{solicitud.Nombre}</TableCell>
                    <TableCell sx={{ maxWidth: 120, padding: '4px' }}>
                      <Box display="flex" gap={1} justifyContent="center" flexWrap="nowrap">
                        {solicitud.Estado === 'Pendiente' && (
                          <>
                            <Tooltip title="Presupuestar Documento" arrow>
                              <IconButton
                                onClick={() => handlePresupuestar(solicitud.Número)}
                                size="small"
                                sx={{
                                  backgroundColor: '#aaaaaa',
                                  color: 'white',
                                  '&:hover': { backgroundColor: '#888888' },
                                  borderRadius: 2,
                                  padding: '4px',
                                  minWidth: 32,
                                  minHeight: 32,
                                }}
                              >
                                <AttachMoneyIcon fontSize="small" />
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
                                  '&:hover': { backgroundColor: '#CC8400' },
                                  borderRadius: 2,
                                  padding: '4px',
                                  minWidth: 32,
                                  minHeight: 32,
                                }}
                              >
                                <DoDisturbAltIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        {solicitud.Estado === 'Iniciada' && (
                          <>
                            <Tooltip title="Documentar Solicitud" arrow>
                              <IconButton
                                onClick={() => handleDocumentar(solicitud.Número)}
                                size="small"
                                sx={{
                                  backgroundColor: '#000080',
                                  color: 'white',
                                  '&:hover': { backgroundColor: '#0a0a5c' },
                                  borderRadius: 2,
                                  padding: '4px',
                                  minWidth: 32,
                                  minHeight: 32,
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
                                  '&:hover': { backgroundColor: '#b71c1c' },
                                  borderRadius: 2,
                                  padding: '4px',
                                  minWidth: 32,
                                  minHeight: 32,
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        {solicitud.Estado === 'Presupuestada' && (
                          <Tooltip title="Cancelar y Eliminar Solicitud" arrow>
                            <IconButton
                              color="error"
                              onClick={() => handleEliminar(solicitud)}
                              size="small"
                              sx={{
                                backgroundColor: '#FFA500',
                                color: 'white',
                                '&:hover': { backgroundColor: '#CC8400' },
                                borderRadius: 2,
                                padding: '4px',
                                minWidth: 32,
                                minHeight: 32,
                              }}
                            >
                              <DoDisturbAltIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
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

export default Solicitudes;
