import React, { useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Box,
  Button,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";

const NuevaInterferencia = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    cuit: "",
    nombre: "",
    apellido: "",
    persona: "",
    email: "",
    calle: "",
    altura: "",
    piso: "",
    dpto: "",
    vereda: "",
    entre1: "",
    entre2: "",
    localidad: "",
    latitud: "",
    longitud: "",
    desde: "",
    hasta: "",
    fecha: new Date().toISOString().split('T')[0], // Fecha actual
    mapa: "",
    path: "",
    usuario: localStorage.getItem("username"),
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/interferencias/nueva-solicitud`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al enviar la solicitud");

      const data = await response.json();
      setSnackbarSeverity("success");
      setSnackbarMessage("Solicitud enviada correctamente");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Error al enviar la solicitud");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Nueva Solicitud de Interferencia
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Datos del Solicitante
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="CUIT" name="cuit" value={formData.cuit} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Tipo de Persona" name="persona" value={formData.persona} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
            </Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Ubicación de la Interferencia
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Calle" name="calle" value={formData.calle} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField label="Altura" name="altura" value={formData.altura} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField label="Vereda" name="vereda" value={formData.vereda} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField label="Entre calle 1" name="entre1" value={formData.entre1} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField label="Entre calle 2" name="entre2" value={formData.entre2} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Localidad" name="localidad" value={formData.localidad} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField label="Piso" name="piso" value={formData.piso} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField label="Dpto" name="dpto" value={formData.dpto} onChange={handleChange} fullWidth />
            </Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Coordenadas y Fechas
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <TextField label="Latitud" name="latitud" value={formData.latitud} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField label="Longitud" name="longitud" value={formData.longitud} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField label="Desde" name="desde" value={formData.desde} onChange={handleChange} type="date" fullWidth />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField label="Hasta" name="hasta" value={formData.hasta} onChange={handleChange} type="date" fullWidth />
            </Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Otros Datos
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Mapa" name="mapa" value={formData.mapa} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Path" name="path" value={formData.path} onChange={handleChange} fullWidth />
            </Grid>
          </Grid>
        </Paper>

        <Box mt={2}>
          <Button type="submit" variant="contained" color="success">
            Enviar Solicitud
          </Button>
        </Box>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NuevaInterferencia;
