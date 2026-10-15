import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Perfil() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Mi Perfil</h2>
      <p>Bienvenido: {user.email}</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}