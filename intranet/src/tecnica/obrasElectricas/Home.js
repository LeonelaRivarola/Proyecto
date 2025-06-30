import React from 'react'
import { Grid, Box } from '@mui/material'
import HeaderUsu from '../../componentes/headerUsu/HeaderUsu'
import SideBar from '../../componentes/sideBar/SideBar'
import Footer from '../../componentes/footer/Footer'
import { Outlet } from 'react-router-dom'
import '../../../public/assets/corpico-icon.png'
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
          <Box sx={{ flexGrow: 1, position: 'relative' }}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '300px',
                height: '300px',
                opacity: 0.05,
                zIndex: 0,
                filter: 'grayscale(100%)',
                pointerEvents: 'none',
              }}
            >
              <img
                src="/assets/corpico-icon.png"
                alt="Corpico Icon"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Box>
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
