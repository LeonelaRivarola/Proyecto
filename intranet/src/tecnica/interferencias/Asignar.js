import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
  Box,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
    mapa: "",
    path: ""
  });

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


  return (
    <div>
      asignarrr {id}
    </div>
  )
}

export default Asignar
