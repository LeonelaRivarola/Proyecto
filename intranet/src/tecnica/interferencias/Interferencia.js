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
    Button,
    Box,
} from '@mui/material';
import { API_URL } from '../../config';
import { useNavigate } from 'react-router-dom';

const Interferencias = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [interferencias, setInterferencias] = useState([]);
    const [localidades, setLocalidades] = useState([]);

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
            setInterferencias(data);
        } catch (err) {

        }
    };

    useEffect(() => {
        fetchInteferencias();
        console.log(localStorage.getItem("token"));
        setLocalidades([
            { LOC_ID: 9966, LOC_DESCRIPCION: "Dorila" },
            { LOC_ID: 10041, LOC_DESCRIPCION: "Gral Pico" },
            { LOC_ID: 10303, LOC_DESCRIPCION: "Metileo" },
            { LOC_ID: 10341, LOC_DESCRIPCION: "Speluzzi" },
            { LOC_ID: 10349, LOC_DESCRIPCION: "Trebolares" },
            { LOC_ID: 10366, LOC_DESCRIPCION: "Vertiz" },
        ]);
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
                                        <TableCell> {interferencia.Calle} <strong>,</strong> {interferencia.Dpto} <strong>Entre </strong>{interferencia.Entre1} <strong>y</strong> {interferencia.Entre2}</TableCell>
                                        <TableCell>Estado...</TableCell>
                                        <TableCell>{interferencia.Fecha_interf}</TableCell>
                                        <TableCell>{interferencia.Desde}</TableCell>
                                        <TableCell>{interferencia.Hasta}</TableCell>
                                        <TableCell>
                                            {localidades.find(loc => loc.LOC_ID === interferencia.ID_Localidad)?.LOC_DESCRIPCION || 'Sin localidad'}
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

export default Interferencias;