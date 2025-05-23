import React from 'react'
import { AppBar, Toolbar, Box, Typography, Button } from '@mui/material'

const HeaderUsu = () => {
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
                        Hola, username.
                    </Typography>
                    <Button sx={{ color: 'black' }}>
                        Salir
                    </Button>
                </Box>
            </AppBar>
        </div>
    )
}

export default HeaderUsu
