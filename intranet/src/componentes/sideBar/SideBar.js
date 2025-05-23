import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
} from '@mui/material';
import {
  Domain,
  Phone,
  Business,
  Group,
  ReceiptLong,
  CameraAlt,
  ElectricalServices,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';


const SideBar = () => {
  const location = useLocation();
  const activePage = location.pathname;

  const [openTecnica, setOpenTecnica] = useState(false);
  const [openObras, setOpenObras] = useState(false);

  const isActive = (path) => activePage === path;

  const getItemStyle = (path) => ({
    borderRadius: '8px',
    marginBottom: '4px',
    marginRight: '5px',
    bgcolor: isActive(path) ? 'green' : 'black',
    '&.Mui-selected': {
      bgcolor: 'green',
      '&:hover': {
        bgcolor: 'darkgreen',
      },
    },
    '&:hover': {
      bgcolor: 'green',
    },
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 260,
          boxSizing: 'border-box',
          backgroundColor: 'black',
          color: 'white',
          borderRadius: '16px',
          margin: 2,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.4)',
          position: 'fixed',
          height: 'calc(100% - 32px)', 
        }
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <img src="../../assets/Corpico_logo.svg" alt="logo" style={{ maxWidth: '80%' }} />
      </Box>


      <List>
        {/* Técnica */}
        <ListItemButton onClick={() => setOpenTecnica(!openTecnica)}>
          <ListItemIcon><ElectricalServices sx={{ color: 'white' }} /></ListItemIcon>
          <ListItemText primary="Técnica" />
          {openTecnica ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openTecnica} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <ListItemButton onClick={() => setOpenObras(!openObras)}>
              <ListItemText primary="Obras Eléctricas" />
              {openObras ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openObras} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 4 }} borderRadius={5}>
                <ListItemButton
                  component={Link}
                  to="/home/nueva-solicitud"
                  selected={isActive('/home/nueva-solicitud')}
                  sx={getItemStyle('/home/nueva-solicitud')}
                >
                  <ListItemText primary="Nueva Solicitud" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/home/solicitudes"
                  selected={isActive('/home/solicitudes')}
                  sx={getItemStyle('/home/solicitudes')}
                >
                  <ListItemText primary="Solicitudes" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/home/presupuestos"
                  selected={isActive('/home/presupuestos')}
                  sx={getItemStyle('/home/presupuestos')}
                >
                  <ListItemText primary="Presupuestos" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/home/tipos-obras"
                  selected={isActive('/home/tipos-obras')}
                  sx={getItemStyle('/home/tipos-obras')}
                >
                  <ListItemText primary="Tipos de Obras" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/home/emails-solicitudes"
                  selected={isActive('/home/emails-solicitudes')}
                  sx={getItemStyle('/home/emails-solicitudes')}
                >
                  <ListItemText primary="E-mails Solicitudes" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        </Collapse>
      </List>

    </Drawer>
  )
}

export default SideBar
