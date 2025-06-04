import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from '@mui/material';

const ModalEliminarSolicitud = ({ open, onClose, onConfirm, itemName }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogContent>
                <Typography>
                    ¿Estás seguro que quieres eliminar esta solicitud? Esta acción no se puede deshacer.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained">
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ModalEliminarSolicitud
