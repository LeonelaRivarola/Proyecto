import { Navigate } from "react-router-dom";

// const isTokenValid = (token) => {
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.exp * 1000 > Date.now(); 
//   } catch {
//     return false;
//   }
// };

const isTokenValid = (token) => {
  if (token === 'token-falso-12345') return true; // Acepta el token simulado

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const SesionProtegida = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token || !isTokenValid(token)) {
    return <Navigate to="/" replace />;
  }
  return children;
};


export default SesionProtegida;
