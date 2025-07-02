// src/tecnica/interferencia/Interferencias.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  FormControl, InputLabel, Select, MenuItem, Alert, Paper, TableContainer, Table,
  TableHead, TableRow, TableCell, TableBody, Typography, Button, Tooltip, IconButton
} from '@mui/material';

import UploadFileIcon from '@mui/icons-material/UploadFile';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import ModalEliminarInterferencia from '../../componentes/modales/ModalEliminarInterferencia';

const Interferencias = () => {
  const [interferencias, setInterferencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [mensajeVisible, setMensajeVisible] = useState(false);
  const [mensajeTexto, setMensajeTexto] = useState('');
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [eliminarInter, setEliminarInter] = useState({});

  const handleEliminar = (interferencia) => {
    setEliminarInter(interferencia);
    setModalOpen(true);
  }

  const handleCloseModal = () => {
    setModalOpen(false);
    setEliminarInter({});
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/tecnica/interferencia/${eliminarInter.ID}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMensajeTexto('Interferencia eliminada correctamente.');
      setMensajeVisible(true);
      setTimeout(() => setMensajeVisible(false), 4000);
      fetchInterferencias(); // recargar la lista
    } catch (error) {
      console.error('Error eliminando interferencia:', error);
    } finally {
      setModalOpen(false);
    }
  };

  useEffect(() => {
    fetchInterferencias();
  }, [])

  const fetchInterferencias = async () => {
    try {
      const token = localStorage.getItem('token');
      const respuesta = await fetch(`${API_URL}/api/tecnica/interferencia/Interferencias`, {
        headers: {
          // 'Content-Type': 'application/json',
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
          <MenuItem value="Pendiente">Pendiente</MenuItem>
          <MenuItem value="Asignada">Asignada</MenuItem>
          <MenuItem value="Revisión">Revisión</MenuItem>
          <MenuItem value="Cerrada">Cerrada</MenuItem>
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
          onClick={() => navigate('/Home/interferencias/nueva')}
        >
          NUEVA INTERFERENCIA
        </Button>
      </Paper>
      <Box sx={{ maxWidth: '100%', mx: 'auto', mt: 4 }}>
        <TableContainer component={Paper} elevation={2} sx={{ overflow: 'hidden' }}>
          <Table size="small" sx={{ minWidth: '100%', tableLayout: 'auto' }}>
            <TableHead>
              <TableRow>
                {['Solicitud', 'Empresa / Particular', 'Dirección', 'Estado', 'Fecha de solicitud', 'Fecha de inicio', 'Fecha de fin', 'Localidad', 'Acciones'].map(header => (
                  <TableCell
                    key={header}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontWeight: 'bold',
                      backgroundColor: '#C8E6C9',
                      maxWidth:
                        header === 'Solicitud' ? 70 :
                          header === 'Empresa / Particular' ? 80 :
                            header === 'Dirección' ? 130 :
                              header === 'Estado' ? 140 :
                                header === 'Fecha de solicitud' ? 120 :
                                  header === 'Fecha de inicio' ? 110 :
                                    header === 'Fecha de fin' ? 110 :
                                      header === 'Localidad' ? 110 :
                                        header === 'Acciones' ? 90 : undefined,
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
                  <TableRow key={interferencia.ID} hover>
                    <TableCell>{interferencia.Nombre} {interferencia.Apellido} </TableCell>
                    <TableCell>{interferencia.Calle} {interferencia.Altura},  {interferencia.Piso ? `Piso ${interferencia.Piso}` : ''} {interferencia.Dpto ? `Dpto ${interferencia.Dpto}` : ''}, entre {interferencia.Entre1} y {interferencia.Entre2}</TableCell>
                    <TableCell>{interferencia.Estado}</TableCell>
                    <TableCell>{formatDate(interferencia.Fecha_interf)}</TableCell>
                    <TableCell>{formatDate(interferencia.Desde)}</TableCell>
                    <TableCell>{formatDate(interferencia.Hasta)}</TableCell>
                    <TableCell>{interferencia.Localidad}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={2}>
                        {interferencia.Estado === 'Pendiente' ? (
                          <Box display="flex" gap={1.5}>
                            <Tooltip title="Asignar Documento" arrow>
                              aca tiene que asginarse o anotarse como empelado asignado para la gestion de la interf
                            </Tooltip>
                            <Tooltip title="Cancelar y Eliminar Solicitud" arrow>
                              <IconButton
                                color="error"
                                onClick={() => handleEliminar(interferencia)}
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
                        ) : null}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <ModalEliminarInterferencia
        open={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        itemId={eliminarInter.ID}
      />
    </Box>
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
