import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import {
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Box,
  Typography,
  Paper
} from '@mui/material';

const EditarInterferencia = () => {
  const { id } = useParams();
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

  return (
    <div>

    </div>
  )
}

export default EditarInterferencia
