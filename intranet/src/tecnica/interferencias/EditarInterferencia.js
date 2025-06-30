import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import {
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Grid,
  Box,
  Typography,
  Paper
} from '@mui/material';

const EditarInterferencia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cuit: "",
    nombre: "",
    apellido: "",
    es_persona: "S",
    email: "",
    calle: "",
    altura: "",
    piso: "",
    dpto: "",
    vereda: "I",
    entre1: "",
    entre2: "",
    localidad: "",
    latitud: "",
    longitud: "",
    desde: "",
    hasta: "",
    mapa: "",
    path: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked ? "S" : "N" }))
  };

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/tecnica/interferencia/interferenciaID/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        setFormData({
          cuit: data.cuit || '',
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          es_persona: data.es_persona || 'N',
          email: data.email || '',
          calle: data.calle || '',
          altura: data.altura || '',
          piso: data.piso || '',
          dpto: data.dpto || '',
          vereda: data.vereda || 'I',
          entre1: data.entre1 || '',
          entre2: data.entre2 || '',
          localidad: data.localidad || '',
          latitud: data.latitud || '',
          longitud: data.longitud || '',
          desde: data.desde || '',
          hasta: data.hasta || '',
          mapa: data.mapa || '',
          path: data.path || ''
        });
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };

    fetchDatos();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/tecnica/interferencia/editar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      navigate('/home/interferencias');
    } catch (err) {
      console.log('Error al actualizar interferencia', err);
    }
  };


  return (
    <Box>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, margin: 'auto', marginTop: 6 }}>
        <Typography variant="6" gutterBottom>
          Editar Interferencia
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {[
              "cuit", "nombre", "apellido", "email", "calle", "altura",
              "piso", "dpto", "entre1", "entre2", "localidad",
              "latitud", "longitud", "desde", "hasta", "mapa", "path"
            ].map((field) => (
              <Grid item xs={12} sm={field.length > 5 ? 12 : 6} key={field}>
                <TextField
                  fullWidth
                  name={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={handleChange}
                />
              </Grid>
            ))}

            <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.es_persona === 'S'}
                  onChange={handleSwitchChange}
                  name="es_persona"
                />
              }
              label="¿Es Personal o Empresa?"
            />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
              control={
                <Switch
                checked={formData.vereda === "D"}
                onChange={(e) =>
                  setFormData({...formData, vereda: e.target.checked ? "D" : "I"})
                }
                name="vereda" 
                />
              }
              label={`Vereda: ${formData.vereda === "D" ? "Derecha" : "Izquierda"}`}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                 Guardar Cambios
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}

export default EditarInterferencia
