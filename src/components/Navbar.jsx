import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg shadow-sm" style={{ backgroundColor: '#F5E6D3' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" style={{ color: '#5C4033' }}>
          PawtoPaw 🐾
        </Link>
        <div className="navbar-nav ms-auto gap-3">
          <Link className="nav-link fw-semibold" to="/login" style={{ color: '#8B5A2B' }}>Iniciar Sesión</Link>
          <Link className="nav-link fw-semibold" to="/registro" style={{ color: '#8B5A2B' }}>Regístrate</Link>
          <Link className="nav-link fw-semibold" to="/perfil" style={{ color: '#8B5A2B' }}>Mi Perfil</Link>
        </div>
      </div>
    </nav>
  );
}