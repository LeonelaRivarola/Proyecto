import React, { useEffect, useState } from 'react';

import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Box,
} from '@mui/material';
import { API_URL } from '../../../config';

const EmailSolicitudes = () => {
  const [emails, setEmails] = useState([]);

  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem('token');
      const respuesta = await fetch(`${API_URL}/api/tecnica/obrasElectricas/emails`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await respuesta.json();
      setEmails(data);
    } catch (err) {
      console.log("Hubo un error al cargar los mails: " + err);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <Box sx={{ height: '10px' }}>
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
          Listado de Emails
        </Typography>
      </Paper>

      <Box sx={{ maxWidth: '100%', mx: 'auto', mt: 4 }}>
        <TableContainer component={Paper} elevation={2} sx={{ overflow: 'hidden' }}>
          <Table size="small" sx={{ minWidth: '100%', tableLayout: 'auto' }}>
            <TableHead>
              <TableRow>
                {['DESTINO', 'USUARIO', 'FECHA'].map(header => (
                  <TableCell
                    key={header}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontWeight: 'bold',
                      backgroundColor: '#C8E6C9',
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
              {emails
              .map((email, index) => (
                <TableRow key={index}>
                  <TableCell>{email.EMSO_DESTINO}</TableCell>
                  <TableCell>{email.EMSO_USUARIO}</TableCell>
                  <TableCell>{email.EMSO_FECHA}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default EmailSolicitudes;
