import React, { useContext } from 'react'
import { AppBar, Toolbar, Box, Typography, Button } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import { Navigate, useNavigate } from 'react-router-dom';

const HeaderUsu = () => {
    const nombreUsuario = localStorage.getItem('username');
    const navigate = useNavigate();

    const CerrarSesion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/Home');
    }
    
    return (
        <div>
            <AppBar
                position="static"
                color="transparent"
                elevation={0}
                sx={{
                    boxShadow: 'none',
                    border: 'none',
                    padding: '8px 16px',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Typography variant="body1">
                        Hola, {nombreUsuario}.
                    </Typography>
                    <Button sx={{ color: 'black', fontWeight: 'bold' }} onClick={CerrarSesion}>
                        <PersonIcon />
                        Salir
                    </Button>
                </Box>
            </AppBar>
        </div>
    )
}

export default HeaderUsu
