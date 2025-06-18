import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Switch, TextField, FormControlLabel
} from '@mui/material';

const PresupuestarSolicitud = () => {
  const location = useLocation();
  const { solicitud } = location.state || {};

  return (
    <div>
      sector acreditar solicitud
    </div>
  )
}

export default PresupuestarSolicitud
