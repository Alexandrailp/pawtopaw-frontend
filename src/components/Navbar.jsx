import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', background: '#f8f9fa', display: 'flex', gap: '1rem' }}>
      <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>
        PawtoPaw 🐾
      </Link>
      <Link to="/login" style={{ textDecoration: 'none', color: '#007bff' }}>Iniciar Sesión</Link>
      <Link to="/registro" style={{ textDecoration: 'none', color: '#28a745' }}>Regístrate</Link>
      <Link to="/perfil" style={{ textDecoration: 'none', color: '#6c757d' }}>Mi Perfil</Link>
    </nav>
  );
}