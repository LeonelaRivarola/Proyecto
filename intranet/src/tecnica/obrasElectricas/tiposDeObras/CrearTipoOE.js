import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../../config';
import {
    TextField,
    FormControlLabel,
    Switch,
    Button,
    Box,
    Typography,
    Paper
} from '@mui/material';

const CrearTipoOE = () => {
    const [formData, setFormData] = useState({
        abreviatura: '',
        descripcion: '',
        interno: false,
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (e) => {
        setFormData((prev) => ({ ...prev, interno: e.target.checked }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const datosAGuardar = {
            ...formData,
            interno: formData.interno ? 'S' : 'N',
        };

        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/api/tecnica/obrasElectricas/nuevo-tipoObras`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(datosAGuardar),
            });

            navigate('/home/tipos-obras');
        } catch (err) {
            console.error('Error al crear:', err);
        }
    };

    const handleCancel = () => {
        navigate('/home/tipos-obras');
    };

    return (
        <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, margin: 'auto', marginTop: 6 }}>
            <Typography variant="h6" gutterBottom>
                Crear Tipo de Obra Electrica
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box display="flex" flexWrap="wrap" gap={3}>
                    <TextField
                        label="Abreviatura"
                        name="abreviatura"
                        value={formData.abreviatura}
                        onChange={handleChange}
                        required
                        sx={{ flex: '1 1 200px' }}
                    />
                    <TextField
                        label="Descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        required
                        sx={{ flex: '2 1 300px' }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.interno}
                                onChange={handleSwitchChange}
                                name="interno"
                                color="primary"
                            />
                        }
                        label={`Interno: ${formData.interno ? 'Sí' : 'No'}`}
                        sx={{ alignSelf: 'center' }}
                    />
                </Box>
                <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                    <Button variant="outlined" color="secondary" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Crear
                    </Button>
                </Box>
            </form>
        </Paper>
    )
}

export default CrearTipoOE
