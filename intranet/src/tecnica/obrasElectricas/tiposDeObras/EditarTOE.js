import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Box,
  Typography,
  Paper
} from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import { API_URL } from '../../../config';

const EditarTOE = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    abreviatura: '',
    descripcion: '',
    interno: '',
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
      const respuesta = await fetch(`${API_URL}/api/tecnica/obrasElectricas/editar-tipoObras/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosAGuardar),
      });
      const data = await respuesta.json();
    } catch (err) {
      console.log(err);
    }

  };

  const handleCancel = () => {
    setFormData({
      abreviatura: '',
      descripcion: '',
      interno: '',
    });

    navigate('/home/tipos-obras');

  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, margin: 'auto', marginTop: 6 }}>
      <Typography variant="h6" gutterBottom>
        Editar TOE
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Abreviatura"
            name="abreviatura"
            value={formData.abreviatura}
            onChange={handleChange}
            required
          />
          <TextField
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            multiline
            rows={3}
            required
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
          />

          <Box display="flex" justifyContent="space-between" gap={2}>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Actualizar
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default EditarTOE;
