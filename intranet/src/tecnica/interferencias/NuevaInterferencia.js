import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { Send, Cancel } from '@mui/icons-material';
import MapaInterferencia from './MapaInterferencia';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const NuevaInterferencia = () => {
  const navigate = useNavigate();
  const [localidades, setLocalidades] = useState([]);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMapData = (data) => {
    setFormData((prev) => ({ ...prev, mapa: data }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, path: file }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const dataToSend = new FormData();

      // Agregamos cada campo
      for (const key in formData) {
        dataToSend.append(key, formData[key]);
      }

      const response = await fetch(`${API_URL}/api/tecnica/interferencia/nueva`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: dataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return;
      }

      navigate('/home/interferencias');

    } catch (err) {
      console.log("error:" + err);
    }
  };

  useEffect(() => {
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
    <Container maxWidth="xl">
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
          Nueva Solicitud de Interferencia
        </Typography>
      </Paper>
      <Grid container spacing={2}>
        {/* Columna izquierda: Formularios */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit}>
                {/* Solicitante */}
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Solicitante</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <TextField label="CUIT/DNI" name="cuit" value={formData.cuit} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} md={4.5}>
                      <TextField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} md={4.5}>
                      <TextField label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Es Persona</InputLabel>
                        <Select name="es_persona" value={formData.es_persona} onChange={handleChange}>
                          <MenuItem value="S">Personal</MenuItem>
                          <MenuItem value="N">Empresa</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Ubicación */}
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Ubicación</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField label="Calle" name="calle" value={formData.calle} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField label="Altura" name="altura" value={formData.altura} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Localidad</InputLabel>
                        <Select name="localidad" value={formData.localidad} onChange={handleChange}>
                          <MenuItem value="" disabled>Seleccione</MenuItem>
                          {localidades.map((loc) => (
                            <MenuItem key={loc.LOC_ID} value={loc.LOC_ID}>
                              {loc.LOC_DESCRIPCION}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField label="Piso" name="piso" value={formData.piso} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField label="Dpto" name="dpto" value={formData.dpto} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel>Vereda</InputLabel>
                        <Select name="vereda" value={formData.vereda} onChange={handleChange}>
                          <MenuItem value="I">Impar</MenuItem>
                          <MenuItem value="P">Par</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField label="Entre calle 1" name="entre1" value={formData.entre1} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField label="Entre calle 2" name="entre2" value={formData.entre2} onChange={handleChange} fullWidth />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Detalles de Interferencia */}
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Detalles de Interferencia</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField label="Latitud" name="latitud" value={formData.latitud} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField label="Longitud" name="longitud" value={formData.longitud} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField type="date" label="Desde" name="desde" value={formData.desde} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField type="date" label="Hasta" name="hasta" value={formData.hasta} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
                    </Grid>
                  </Grid>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Mapa de Interferencia</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ width: '1000px', height: 400 }}>
                        <MapaInterferencia onData={(data) => setFormData(prev => ({ ...prev, mapa: data }))} />
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Subir Archivo</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<AttachFileIcon />}
                          sx={{ textTransform: 'none', mt: 1, color: 'green' }}
                        >
                          Seleccionar archivo
                          <input
                            type="file"
                            hidden
                            name="path"
                            accept=".pdf,.jpg,.jpeg,.png,.kml"
                            onChange={handleFileChange}
                          />
                        </Button>
                        {formData.path && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Archivo seleccionado: {formData.path.name}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Botones */}
                <Grid container justifyContent="center" spacing={2}>
                  <Grid item>
                    <Button type="submit" variant="contained" color="success" startIcon={<Send />}>Crear</Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" color="error" startIcon={<Cancel />} onClick={() => navigate('/home/solicitudes')}>Cancelar</Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NuevaInterferencia;
