import React, { useEffect, useState } from 'react'
import { API_URL } from '../../../config';

const Solicitudes = () => {
  const [solicitudes, setSolicitudes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/api/tecnica/obrasElectricas/solicitudes`);
        const data = await respuesta.json();
        console.log(data);
        setSolicitudes(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }

    fetchSolicitudes();
  }, []);

  return (
    <div>
      Solicitudes conectadas al back ¿?
    </div>
  )
}

export default Solicitudes
