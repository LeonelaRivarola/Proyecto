import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import MapaInterferencia from './MapaInterferencia';
import VerMapa from './mapas/VerMapa';
import {
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Grid,
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
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

  const localidades = [
    { LOC_ID: 9966, LOC_DESCRIPCION: "Dorila" },
    { LOC_ID: 10041, LOC_DESCRIPCION: "Gral Pico" },
    { LOC_ID: 10303, LOC_DESCRIPCION: "Metileo" },
    { LOC_ID: 10341, LOC_DESCRIPCION: "Speluzzi" },
    { LOC_ID: 10349, LOC_DESCRIPCION: "Trebolares" },
    { LOC_ID: 10366, LOC_DESCRIPCION: "Vertiz" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'localidad' ? parseInt(value) : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
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

        const localidadEncontrada = localidades.find(loc => loc.LOC_DESCRIPCION === data.Localidad);
        const localidadId = localidadEncontrada ? localidadEncontrada.LOC_ID : null;

        console.log(data.Mapa);

        setFormData({
          cuit: data.CUIT_DNI || '',
          nombre: data.Nombre || '',
          apellido: data.Apellido || '',
          es_persona: data.Es_persona || 'N',
          email: data.Email || '',
          calle: data.Calle || '',
          altura: data.Altura || '',
          piso: data.Piso || '',
          dpto: data.Dpto || '',
          vereda: data.Vereda || 'I',
          entre1: data.Entre1 || '',
          entre2: data.Entre2 || '',
          localidad: localidadId,
          latitud: data.Latitud || '',
          longitud: data.Longitud || '',
          desde: data.Desde ? data.Desde.split('T')[0] : '',
          hasta: data.Hasta ? data.Hasta.split('T')[0] : '',
          mapa: data.Mapa || '',
          path: data.Path || ''
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
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 900, margin: 'auto', marginTop: 6 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {[
              "cuit", "nombre", "apellido", "email", "calle", "altura",
              "piso", "dpto", "entre1", "entre2",
              "latitud", "longitud", "desde", "hasta", "path"
            ].map((field) => (
              <Grid item xs={12} sm={field.length > 5 ? 12 : 6} key={field}>
                <TextField
                  fullWidth
                  type={['desde', 'hasta'].includes(field) ? 'date' : 'text'}
                  name={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={handleChange}
                />
              </Grid>
            ))}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="localidad-label">Localidad</InputLabel>
                <Select
                  labelId="localidad-label"
                  id="localidad"
                  name="localidad"
                  value={formData.localidad}
                  label="Localidad"
                  onChange={handleChange}
                >
                  {localidades.map((loc) => (
                    <MenuItem key={loc.LOC_ID} value={loc.LOC_ID}>
                      {loc.LOC_DESCRIPCION}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item>
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
                <Grid item>
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
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ mt: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Vista del Mapa Guardado:
              </Typography>
              <Box sx={{ width: '900px', height: 400 }}>
                <MapaInterferencia
                  initialPosition={{ lat: parseFloat(formData.latitud), lng: parseFloat(formData.longitud) }}
                  geojsonData={formData.mapa}
                  onData={(geojson) => setFormData(prev => ({ ...prev, mapa: geojson }))}
                  modoEdicion={false}
                />
              </Box>
            </Grid>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item>
                <Button type="submit" variant="contained" color="primary" >
                  Guardar Cambios
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="error" onClick={() => navigate('/home/interferencias')}>Cancelar</Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}

export default EditarInterferencia
