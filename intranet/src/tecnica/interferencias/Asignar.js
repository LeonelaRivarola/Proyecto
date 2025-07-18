import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { API_URL } from '../../config';

const Asignar = () => {
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
    path: ""
  });

  const localidades = [
    { LOC_ID: 9966, LOC_DESCRIPCION: "Dorila" },
    { LOC_ID: 10041, LOC_DESCRIPCION: "General Pico" },
    { LOC_ID: 10303, LOC_DESCRIPCION: "Metileo" },
    { LOC_ID: 10341, LOC_DESCRIPCION: "Speluzzi" },
    { LOC_ID: 10349, LOC_DESCRIPCION: "Trebolares" },
    { LOC_ID: 10366, LOC_DESCRIPCION: "Vertiz" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

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

        const normalizar = (str) =>
          str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

        const localidadEncontrada = localidades.find(loc =>
          normalizar(loc.LOC_DESCRIPCION) === normalizar(data.Localidad)
        );

        const localidadId = localidadEncontrada ? localidadEncontrada.LOC_ID : null;

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
          path: data.Path || ''
        });
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };

    fetchDatos();
  }, [id]);

  return (
    <Box>
      <Paper
        elevation={4}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderRadius: 3,
          background: 'linear-gradient(90deg, #43a047, #66bb6a)',
          color: "white",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Asignar Interferencia N° {id}
        </Typography>
      </Paper>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: '100%', margin: 'auto', marginTop: 6 }}>
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
                  readOnly
                  disabled
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
                  readOnly
                  disabled
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
                        name="vereda"
                        readOnly
                        disabled
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
                        name="es_persona"
                        readOnly
                        disabled
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
                <p>Mapita</p>
              </Box>
            </Grid>

          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}

export default Asignar
