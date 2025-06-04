import React from 'react'
import { Grid, Box } from '@mui/material'
import HeaderUsu from '../../componentes/headerUsu/HeaderUsu'
import SideBar from '../../componentes/sideBar/SideBar'
import Footer from '../../componentes/footer/Footer'
import { Outlet } from 'react-router-dom'
import '../../css/tecnica.css';

const Home = () => {
  return (
    <Grid container sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* SIDE BAR FIJO */}
      <Grid item xs={3} sx={{ height: '100vh', position: 'fixed', left: 0, top: 0 }}>
        <SideBar />
      </Grid>

      {/* CONTENIDO PRINCIPAL */}
      <Grid
        item
        xs={9}
        sx={{
          marginLeft: '300px',
          width: 'calc(100% - 300px)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        {/* HEADER */}
        <Box sx={{ flexShrink: 0 }}>
          <HeaderUsu />
        </Box>

        {/* CONTENIDO + FOOTER */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            padding: 2,
            backgroundColor: 'white',
          }}
        >
          {/* CONTENIDO DINÁMICO */}
          <Box sx={{ flexGrow: 1 }}>
            <Outlet />
          </Box>

          {/* FOOTER AL FINAL DEL CONTENEDOR */}
          <Box
            sx={{
              flexShrink: 0,
              textAlign: 'center',
              padding: '10px 0',
              backgroundColor: '#f5f5f5',
              color: 'black',
              marginTop: '15px',
              borderRadius: '8px'
            }}
          >
            <Footer />
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Home
