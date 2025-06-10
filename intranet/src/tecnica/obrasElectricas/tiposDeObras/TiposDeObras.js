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
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { Outlet } from 'react-router-dom';
import { API_URL } from '../../../config';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalEliminarTipoObra from '../../../componentes/modales/ModalEliminarTipoObra';
import { Navigate, useNavigate } from 'react-router-dom';

const TiposDeObras = () => {
  const [tipoObras, setTipoObras] = useState([]);
  const [tipoObraE, setTipoObraE] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [mensajeVisible, setMensajeVisible] = useState(false);
  const [mensajeTexto, setMensajeTexto] = useState('');
  const navigate = useNavigate();

  const fetchTiposOE = async () => {
    try {
      const token = localStorage.getItem('token');
      const respuesta = await fetch(`${API_URL}/api/tecnica/obrasElectricas/tipoObras`, {
        method: 'GET',
        headers: {
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

  useEffect(() => {
    fetchTiposOE();
  }, [])

  const handleEditarTO = (id) => {
    navigate(`/home/editar/${id}`);
  }

  const handleEliminarTO = (id) => {
    setTipoObraE(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/tecnica/obrasElectricas/eliminar-tipoObra/${tipoObraE.TOE_ID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setMensajeTexto(`Se ha eliminado exitosamente el tipo de Obra ${tipoObraE.TOE_ID}`);
      setMensajeVisible(true);

      setTimeout(() => {
        setMensajeVisible(false);
      }, 4000);

      await fetchTiposOE();

    } catch (error) {
      console.error('Error eliminando el tipo de obra:', error);
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <Box>
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
      <Box sx={{ maxWidth: '100%', mx: 'auto', mt: 4 }}>
        <TableContainer component={Paper} elevation={2} sx={{ overflow: 'hidden' }}>
          <Table size="small" sx={{ minWidth: '100%', tableLayout: 'auto' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#5f6368', backgroundColor: '#C8E6C9' }}>ABREVIATURA</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#5f6368', backgroundColor: '#C8E6C9' }}>DESCRIPCIÓN</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#5f6368', backgroundColor: '#C8E6C9' }}>INTERNO</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#5f6368', backgroundColor: '#C8E6C9' }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <Box sx={{ height: '12px' }} />
            <TableBody>
              {tipoObras.map((fila) => (
                <TableRow key={fila.TOE_ID}>
                  <TableCell>{fila.TOE_ABREVIATURA}</TableCell>
                  <TableCell>{fila.TOE_DESCRIPCION}</TableCell>
                  <TableCell>{fila.TOE_INTERNO}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={2}>
                      <Tooltip title="Editar Tipo de Obra" arrow>
                        <IconButton onClick={() => handleEditarTO(fila.TOE_ID)}
                          size="small"
                          sx={{
                            backgroundColor: '#000080',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: '#0a0a5c',
                            },
                            borderRadius: 2,
                            padding: '4px'
                          }}>
                          <NoteAddIcon />
                        </IconButton >
                      </Tooltip>
                      <Tooltip title="Eliminar Tipo de Obra" arrow>
                        <IconButton color="error" onClick={() => handleEliminarTO(fila)}
                          size="small"
                          sx={{
                            backgroundColor: '#d32f2f',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: '#b71c1c',
                            },
                            borderRadius: 2,
                            padding: '4px'
                          }}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Outlet />
      <ModalEliminarTipoObra
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={tipoObraE.TOE_ID}
      />
    </Box >
  )
}

export default TiposDeObras
