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
  Alert,
} from "@mui/material";
import { API_URL } from '../../../config';

const NuevaSolicitud = () => {
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

    if (esInterno) {
      setFormData((prev) => ({ ...prev, ...defaultValues }));
    } else {
      setFormData((prev) => ({
        ...prev,
        cuit: "",
        nombre: "",
        apellido: "",
        email: "",
      }));
    }
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
        setTipo(data);
      } catch (err) {
        setError(err);
      }
    }
    fetchTiposOE();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5">Nueva Solicitud</Typography>

          {/* Conexión */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Typography variant="h6">Conexión</Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Tipos</InputLabel>
                <Select
                  value={tipo}
                  onChange={handleTipoChange}
                  label="Tipos"
                  required
                >
                  <MenuItem value="" disabled>
                    Seleccione
                  </MenuItem>
                  {tipos.map((tipoItem) => (
                    <MenuItem key={tipoItem.TOE_ID} value={tipoItem.TOE_ID}>
                      {tipoItem.TOE_ABREVIATURA} - {tipoItem.TOE_DESCRIPCION}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={10}>
              <TextField
                label="Descripción"
                value={descripcion}
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>

          {/* Titular */}
          <form onSubmit={handleSubmit}>
            <Grid
              container
              spacing={2}
              sx={{
                mt: 2,
                pointerEvents: formEnabled ? "auto" : "none",
                opacity: formEnabled ? 1 : 0.5,
              }}
            >
              <Grid item xs={12}>
                <Typography variant="h6">Titular</Typography>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="DNI/CUIT"
                  name="cuit"
                  value={formData.cuit}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{ readOnly: interno }}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{ readOnly: interno }}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  label="Apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{ readOnly: interno }}
                />
              </Grid>

              {/* Dirección */}
              <Grid item xs={12}>
                <Typography variant="h6">Dirección</Typography>
              </Grid>
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
                    <MenuItem value="" disabled>
                      Seleccione localidad
                    </MenuItem>
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
              <Grid item xs={12} md={4}>
                <TextField
                  label="Piso"
                  name="piso"
                  value={formData.piso}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Dpto"
                  name="dpto"
                  value={formData.dpto}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              {/* Contacto */}
              <Grid item xs={12}>
                <Typography variant="h6">Contacto</Typography>
              </Grid>
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
                  InputProps={{ readOnly: interno }}
                />
              </Grid>
            </Grid>

            {/* Botones */}
            <Grid container justifyContent="center" sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="warning"
                sx={{ mx: 2 }}
              >
                Crear
              </Button>
              <Button
                type="button"
                variant="contained"
                color="error"
                sx={{ mx: 2 }}
                onClick={() => (window.location.href = "/solicitudes")}
              >
                Cancelar
              </Button>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  )
}

export default NuevaSolicitud
