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
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default tipoDeObras
