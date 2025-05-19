import React from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import '../css/tecnica.css'
import Footer from "../componentes/footer/Footer";

const estiloFondo = {
    backgroundImage: 'url(/assets/corpico_central.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '100vh',
};

const Ingresar = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/Home');
    };

    return (
        <div>
            <div style={estiloFondo}>
                <Container component='main' maxWidth='xs' sx={{ position: 'relative' }}>
                    <div className="paper" style={{ position: 'relative' }}>
                        <div className='login-box'>
                            <div className="session overlap-box">
                                <Typography component='h1' variant='h5' style={{ color: "black", fontWeight: 'bold' }}>
                                    Iniciar Sesión
                                </Typography>
                            </div>
                            <form className='sessionForm'>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="usuario"
                                    label="Usuario"
                                    autoFocus
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    type="password"
                                    label="Contraseña"
                                    id="password"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className='btnIngresar'
                                    onClick={handleClick}
                                >
                                    Ingresar
                                </Button>
                            </form>
                        </div>
                    </div>
                </Container>
                <Footer style={{ backgroundColor: "#96e65c", color: "black" }}/>
            </div>
        </div>
    )
}

export default Ingresar

/* 
   BOTON MAS ALEJADO
   CAMPOS QUE SEAN OBLIGATORIOS

   STYLE DEL FOOTER Q CAMBIA SEGUN EN Q PAG ESTÁ
   
*/