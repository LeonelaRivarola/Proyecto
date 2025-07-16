// ./interferenciaModel.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const ModalEliminarInterferencia = ({ open, onClose, onConfirm, itemName }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>¿Eliminar Solicitud?</DialogTitle>
      <DialogContent>¿Estás seguro que querés eliminar la solicitud de <strong>{itemName}</strong>?</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button color="error" onClick={onConfirm}>Eliminar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEliminarInterferencia;
