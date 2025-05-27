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
    nombre: "",
    apellido: "",
    email: "",
    calle: "",
    localidad: "",
    altura: "",
    piso: "",
    dpto: "",
    celular: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  useEffect(() => {
    const fetchTiposOE = async () => {
      try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_URL}/api/tecnica/obrasElectricas/tiposOE`, {
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

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom color="primary">
            Nueva Solicitud
          </Typography>

          {/* Sección: Conexión */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Conexión</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
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
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <TextField
                    label="Dpto"
                    name="dpto"
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
