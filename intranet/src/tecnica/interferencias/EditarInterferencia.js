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
  Paper,
  Divider
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
    setFormData(prev => ({ ...prev, [name]: checked ? "S" : "N" }));
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
          Editar Interferencia
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ padding: 4, maxWidth: 900, margin: 'auto', marginTop: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}><Typography variant="h6">Datos del Solicitante</Typography></Grid>
            {["cuit", "nombre", "apellido", "email"].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  fullWidth
                  name={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={handleChange}
                />
              </Grid>
            ))}

            <Grid item xs={12}><Divider /></Grid>
            <Grid item xs={12}><Typography variant="h6">Ubicación</Typography></Grid>

            {["calle", "altura", "piso", "dpto", "entre1", "entre2", "localidad", "latitud", "longitud"].map((field) => (
              <Grid item xs={12} sm={field.length > 6 ? 12 : 6} key={field}>
                <TextField
                  fullWidth
                  name={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={handleChange}
                />
              </Grid>
            ))}

            <Grid item xs={12}><Divider /></Grid>
            <Grid item xs={12}><Typography variant="h6">Periodo de Obra</Typography></Grid>

            {["desde", "hasta"].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  fullWidth
                  name={field}
                  type="date"
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  InputLabelProps={{ shrink: true }}
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
                label={`${formData.es_persona === "S" ? "Personal" : "Empresa"}`}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.vereda === "P"}
                    onChange={(e) =>
                      setFormData({ ...formData, vereda: e.target.checked ? "P" : "I" })
                    }
                    name="vereda"
                  />
                }
                label={`Vereda: ${formData.vereda === "P" ? "Par" : "Impar"}`}
              />
            </Grid>

            <Grid item xs={12}><Divider /></Grid>
            <Grid item xs={12}><Typography variant="h6">Archivos y Mapa</Typography></Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="mapa"
                label="Mapa (URL)"
                value={formData.mapa}
                onChange={handleChange}
              />
              {formData.mapa && (
                <Box mt={2}>
                  {formData.mapa.includes('http') ? (
                    <img src={formData.mapa} alt="Mapa" style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }} />
                  ) : (
                    <Button variant="outlined" href={formData.mapa} target="_blank">Ver Mapa</Button>
                  )}
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="path"
                label="Archivo (Path)"
                value={formData.path}
                onChange={handleChange}
              />
              {formData.path && (
                <Box mt={1}>
                  <Button variant="outlined" href={formData.path} target="_blank">
                    Ver Archivo
                  </Button>
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="success" fullWidth sx={{ mt: 2 }}>
                Guardar Cambios
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditarInterferencia;
