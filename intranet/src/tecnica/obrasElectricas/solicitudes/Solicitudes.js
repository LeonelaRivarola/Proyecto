import React, { useEffect, useState } from 'react'
import { API_URL } from '../../../config';

const Solicitudes = () => {
  const [solicitudes, setSolicitudes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_URL}/api/tecnica/obrasElectricas/solicitudes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
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


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Cargando solicitudes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-red-100 text-red-800 p-6 rounded-lg shadow-md">
        <p className="text-xl font-bold mb-3">¡Error al cargar los datos!</p>
        <p className="text-md">{error.message}</p>
        <p className="mt-4 text-sm text-red-600">Por favor, intente de nuevo más tarde o contacte a soporte si el problema persiste.</p>
      </div>
    );
  }

  if (!solicitudes || solicitudes.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-yellow-100 text-yellow-800 p-6 rounded-lg shadow-md">
        <p className="text-lg">No hay solicitudes para mostrar en este momento.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">
        Solicitudes 
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider rounded-tl-lg">NÚMERO</th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">ESTADO</th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">FECHA SOLICITUD</th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">USUARIO</th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">TIPO</th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider rounded-tr-lg">DNI/CUIT</th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider rounded-tr-lg">APELLIDO</th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider rounded-tr-lg">NOMBRE</th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider rounded-tr-lg">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {solicitudes.map((solicitud) => (
              <tr key={solicitud.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                <td className="py-3 px-4 text-sm text-gray-800 font-medium">{solicitud.Número}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{solicitud.Estado}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{solicitud.Fecha_Solicitud}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{solicitud.Usuario}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{solicitud.Tipo}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{solicitud.DNI_CUIT}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{solicitud.Apellido}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{solicitud.Nombre}</td>
                <td className="py-3 px-4 text-sm text-gray-800">Botones proximamente</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Solicitudes
