import React from 'react'
import { Grid } from '@mui/material'
import HeaderUsu from '../../componentes/headerUsu/HeaderUsu'
import SideBar from '../../componentes/sideBar/SideBar'
import { Outlet } from 'react-router-dom'
import '../../css/tecnica.css';

const Home = () => {

  return (
    <Grid container sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* SIDE BAR FIJO  */}
      <Grid item xs={3} sx={{ height: '100vh', position: 'fixed', left: 0, top: 0 }}>
        <SideBar />
      </Grid>

      {/* HEADER FIJO + CONTENIDO SELECCIONADO DE SIDE BAR  */}
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
        {/* */}
        <Grid item sx={{ flexShrink: 0 }}>
          <HeaderUsu />
        </Grid>

        {/*  */}
        <Grid
          item
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            padding: 2,
          }}
        >
          <Outlet />
        </Grid>
      </Grid>
    </Grid>

  )
}

export default Home
