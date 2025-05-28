import React, { useEffect, useState } from 'react'
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
import { API_URL } from '../../../config';
import { Send, Cancel } from '@mui/icons-material';

const NuevaSolicitud = () => {
  const navigate = useNavigate();
  const [localidades, setLocalidades] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tipo, setTipo] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [interno, setInterno] = useState(false);
  const [formEnabled, setFormEnabled] = useState(false);

  const [formData, setFormData] = useState({
    cuit: "",
    apellido: "",
    nombre: "",
    calle: "",
    altura: "",
    piso: "",
    dpto: "",
    localidad: "",
    celular: "",
    email: "",
    tipo: "",
    usuario: localStorage.getItem('username')
  });

  const defaultValues = {
    cuit: "30545719386",
    nombre: "Corpico Ltda",
    apellido: "Cooperativa",
    email: "2dojefe_tecnico@corpico.com.ar",
  };

  const handleTipoChange = (e) => {
    const selectedTipo = tipos.find((t) => t.TOE_ID === e.target.value);
    setTipo(e.target.value);
    setDescripcion(selectedTipo?.TOE_DESCRIPCION || "");
    const esInterno = selectedTipo?.TOE_INTERNO === "S";
    setInterno(esInterno);
    setFormEnabled(true);

    setFormData(prev => ({
      ...prev,
      ...(esInterno ? defaultValues : { cuit: "", nombre: "", apellido: "", email: "" })
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/tecnica/obrasElectricas/nueva-solicitud`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      navigate('/home/solicitudes');

    } catch (err) {
      console.err("Error al enviar la solicitud:", err);
      alert("Error al guardar la solicitud");
    }
  };

  useEffect(() => {
    const fetchTiposOE = async () => {
      try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_URL}/api/tecnica/obrasElectricas/tipoObras`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await respuesta.json();
        setTipos(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchTiposOE();
  }, []);

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
    <Container maxWidth="true" sx={{}}>
      <Typography variant="h5" align="left" fontWeight="bold" gutterBottom sx={{ paddingBottom: 2 }}>
        Nueva Solicitud
      </Typography>
      <Card>
        <CardContent>
          {/* Sección: Conexión */}
          <Paper variant="outlined" sx={{ p: 1, mb: 1 }}>
            <Typography variant="h6" gutterBottom>Conexión</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={tipo}
                    onChange={handleTipoChange}
                    label="Tipo"
                    required
                  >
                    <MenuItem value="" disabled>Seleccione</MenuItem>
                    {tipos.map((tipoItem) => (
                      <MenuItem key={tipoItem.TOE_ID} value={tipoItem.TOE_ID}>
                        {tipoItem.TOE_ABREVIATURA}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  label="Descripción"
                  value={descripcion}
                  fullWidth
                  slotProps={{ input: { readOnly: true } }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Sección: Formulario */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              pointerEvents: formEnabled ? "auto" : "none",
              opacity: formEnabled ? 1 : 0.5,
            }}
          >
            {/* Titular */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Titular</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="DNI/CUIT"
                    name="cuit"
                    value={formData.cuit}
                    onChange={handleChange}
                    fullWidth
                    slotProps={{ input: { readOnly: true } }}
                  />
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <TextField
                    label="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    fullWidth
                    slotProps={{ input: { readOnly: true } }}
                  />
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <TextField
                    label="Apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    fullWidth
                    slotProps={{ input: { readOnly: true } }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Dirección */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Dirección</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <TextField
                    label="Calle"
                    name="calle"
                    value={formData.calle}
                    required
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Localidad</InputLabel>
                    <Select
                      name="localidad"
                      value={formData.localidad}
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value="" disabled>Seleccione</MenuItem>
                      {localidades.map((loc) => (
                        <MenuItem key={loc.LOC_ID} value={loc.LOC_ID}>
                          {loc.LOC_DESCRIPCION}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Altura"
                    name="altura"
                    type="number"
                    required
                    value={formData.altura}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <TextField
                    label="Piso"
                    name="piso"
                    value={formData.piso}
                    required
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <TextField
                    label="Dpto"
                    name="dpto"
                    required
                    value={formData.dpto}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Contacto */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Contacto</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Celular"
                    required
                    name="celular"
                    value={formData.celular}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    slotProps={{ input: { readOnly: true } }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Botones */}
            <Grid container justifyContent="center" spacing={2}>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  startIcon={<Send />}
                >
                  Crear
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => navigate('/home/solicitudes')}
                >
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NuevaSolicitud;
