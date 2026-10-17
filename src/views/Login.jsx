import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return alert('Completa todos los campos');

    setUser({ email });
    navigate('/perfil');
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#FDEBD0' }}>
      <div className="card p-5 shadow border-0" style={{ width: '400px', backgroundColor: '#FFFDF9', borderRadius: '20px' }}>
        <h3 className="mb-2 text-center fw-bold" style={{ color: '#5C4033' }}>PawtoPaw</h3>
        <p className="mb-4 text-center" style={{ color: '#8B5A2B' }}>Inicia sesión para continuar</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: '#5C4033' }}>Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="grecia@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderRadius: '10px', borderColor: '#DEB887' }}
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ color: '#5C4033' }}>Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ borderRadius: '10px', borderColor: '#DEB887' }}
            />
          </div>
          <div className="d-grid gap-2">
            <button type="submit" className="btn fw-bold" style={{ backgroundColor: '#A0522D', color: '#FFF', borderRadius: '10px' }}>
              Iniciar Sesión
            </button>
            <button type="button" className="btn btn-link text-decoration-none" onClick={() => navigate('/')} style={{ color: '#8B5A2B' }}>
              Volver al inicio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}