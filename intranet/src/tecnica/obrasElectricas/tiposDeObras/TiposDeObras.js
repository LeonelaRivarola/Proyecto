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
  IconButton,
  Tooltip
} from '@mui/material';
import { Outlet } from 'react-router-dom';
import { API_URL } from '../../../config';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { Navigate, useNavigate } from 'react-router-dom';

const TiposDeObras = () => {
  const [tipoObras, setTipoObras] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchTiposOE();
  }, [])

  const handleEditarTO = (id) => {
    navigate(`/home/tipos-obras/editar-tipoOE/${id}`);
  }

  const handleEliminarTO = (id) => {
    //setSolicitudE(id);
    //setModalOpen(true);
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
                <TableCell sx={{ fontWeight: 'bold', color: '#5f6368', backgroundColor: '#C8E6C9'}}>ABREVIATURA</TableCell>
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
                        <IconButton color="error" onClick={() => handleEliminarTO(fila.TOE_ID)}
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
      <Outlet></Outlet>
    </Box >
  )
}

export default TiposDeObras
