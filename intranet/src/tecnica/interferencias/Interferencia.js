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
import { API_URL } from '../../config';
import { useNavigate } from 'react-router-dom';

const Interferencias = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [interferencias, setInterferencias] = useState([]);

    const fetchInteferencias = async () => {
        try {
            const token = localStorage.getItem('token');
            const respuesta = await fetch(`${API_URL}/api/tecnica/interferencia/Interferencias`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await respuesta.json();
            setInterferencias(data.data);
        } catch (err) {

        }
    };

    useEffect(() => {
        fetchInteferencias();
    }, []);

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
                    onClick={() => navigate('/home/nueva-interferencia')}
                >
                    NUEVA INTERFERENCIA
                </Button>
            </Paper>
            <Box sx={{ maxWidth: '100%', mx: 'auto', mt: 4 }}>
                <TableContainer component={Paper} elevation={2} sx={{ overflow: 'hidden' }}>
                    <Table size="small" sx={{ minWidth: '100%', tableLayout: 'auto' }}>
                        <TableHead>
                            <TableRow>
                                {['Solicitud', 'Empresa / Particular', 'Dirección', 'Estado', 'Fecha de Solicitud', 'Fecha de Inicio', 'Fecha de Fin', 'Localidad'].map(header => (
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
                        {interferencias
                        .map((interferencia) => (
                            <TableRow key={interferencia.ID}>
                                <TableCell>{interferencia.ID}</TableCell>
                                <TableCell>{interferencia.Nombre}</TableCell>
                                <TableCell>Calle: {interferencia.Calle} Dpto: {interferencia.Dpto} Entre: {interferencia.Entre1} y {interferencia.Entre2}</TableCell>
                                <TableCell>Estado...</TableCell>
                                <TableCell>{interferencia.Fecha_interf}</TableCell>
                                <TableCell>{interferencia.Desde}</TableCell>
                                <TableCell>{interferencia.Hasta}</TableCell>
                                <TableCell>{interferencia.ID_Localidad}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>       
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default Interferencias;