import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import '../css/tecnica.css'
import Footer from "../componentes/footer/Footer";
import { API_URL } from "../config";

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
    const [username, setusername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                //localStorage.setItem('token', data.token);
                navigate('/Home');
            } else {
                setError(data.message || 'Error al inciar sesión');
            }

        } catch (err) {
            setError('Error de conexion al servidor');
        }


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
                            <form className='sessionForm' onSubmit={handleSubmit}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="username"
                                    value={username}
                                    autoFocus
                                    onChange={(e) => setusername(e.target.value)}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {error && (
                                    <Typography color="error" variant="body2">
                                        {error}
                                    </Typography>
                                )}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className='btnIngresar'
                                >
                                    Ingresar
                                </Button>
                            </form>
                        </div>
                    </div>
                </Container>
                <Footer style={{ backgroundColor: "#96e65c", color: "black" }} />
            </div>
        </div>
    )
}

export default Ingresar

