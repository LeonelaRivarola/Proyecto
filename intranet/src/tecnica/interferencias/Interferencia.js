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
    Tooltip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { API_URL } from '../../config';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import SummarizeIcon from '@mui/icons-material/Summarize';
import DeleteIcon from '@mui/icons-material/Delete';

const Interferencias = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [interferencias, setInterferencias] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [interferenciaAEliminar, setInterferenciaAEliminar] = useState(null);

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

    const handleEditar = (interferencia) => {
        navigate(`/home/editar-interferencia/${interferencia.ID}`);
    };

    const handleEliminar = (interferencia) => {
        setInterferenciaAEliminar(interferencia);
        setDialogOpen(true);
    };

    const handleAsignar = (interferencia) => {
        navigate(`home/interferencia/asignar/${interferencia.ID}`);
    };

    const confirmarEliminacion = async () => {
        if (!interferenciaAEliminar) return;

        try {
            const token = localStorage.getItem('token');
            const respuesta = await fetch(`${API_URL}/api/tecnica/interferencia/eliminar/${interferenciaAEliminar.ID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (respuesta.ok) {
                setInterferencias((prev) => prev.filter(i => i.ID !== interferenciaAEliminar.ID));
            } else {
                const errorData = await respuesta.json();
                console.error('Error al eliminar:', errorData);
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
        } finally {
            setDialogOpen(false);
            setInterferenciaAEliminar(null);
        }
    };


    useEffect(() => {
        fetchInteferencias();
        //console.log(localStorage.getItem("token"));
    }, []);

    return (
        <Box style={{ zoom: 0.9 }}>
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
                                {['Solicitud', 'Empresa / Particular', 'Dirección', 'Estado', 'Fecha de Solicitud', 'Fecha de Inicio', 'Fecha de Fin', 'Localidad', 'Editar', 'Eliminar', 'Asignar'].map(header => (
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
                                        <TableCell>{interferencia.Estado}</TableCell>
                                        <TableCell>{dayjs(interferencia.Fecha_interf).format('YYYY-MM-DD')}</TableCell>
                                        <TableCell>{dayjs(interferencia.Desde).format('YYYY-MM-DD')}</TableCell>
                                        <TableCell>{dayjs(interferencia.Hasta).format('YYYY-MM-DD')}</TableCell>
                                        <TableCell>
                                            {interferencia.Localidad}
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" gap={1.5}>
                                                <Tooltip title="Editar" arrow>
                                                    <IconButton
                                                        onClick={() => handleEditar(interferencia)}
                                                        size="xl"
                                                        sx={{
                                                            backgroundColor: '#1565c0',
                                                            color: 'white',
                                                            '&:hover': {
                                                                backgroundColor: '#0d47a1',
                                                            },
                                                            borderRadius: 2,
                                                            padding: '4px'
                                                        }}
                                                    >
                                                        <EditDocumentIcon fontSize="xl" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" gap={1.5}>
                                                <Tooltip title="Eliminar" arrow>
                                                    <IconButton
                                                        onClick={() => handleEliminar(interferencia)}
                                                        size="xl"
                                                        sx={{
                                                            backgroundColor: '#e53935',
                                                            color: 'white',
                                                            '&:hover': {
                                                                backgroundColor: '#c62828',
                                                            },
                                                            borderRadius: 2,
                                                            padding: '4px'
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="xl" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" gap={1.5}>
                                                <Tooltip title="Asignar" arrow>
                                                    <IconButton
                                                        onClick={() => handleAsignar(interferencia)}
                                                        size="xl"
                                                        sx={{
                                                            backgroundColor: '#43a047',
                                                            color: 'white',
                                                            '&:hover': {
                                                                backgroundColor: '#357a38',
                                                            },
                                                            borderRadius: 2,
                                                            padding: '4px'
                                                        }}
                                                    >
                                                        <SummarizeIcon fontSize="xl" />
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
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            >
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    ¿Estás seguro que querés eliminar la interferencia #{interferenciaAEliminar?.ID}?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="inherit">
                        Cancelar
                    </Button>
                    <Button onClick={confirmarEliminacion} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
            <Outlet />
        </Box>
    );
};

export default Interferencias;