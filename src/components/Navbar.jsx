import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Navbar() {
  const { user, cantidadTotalCarrito } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [busqueda, setBusqueda] = useState('');

  // Sincronizar el input si el parámetro 'buscar' cambia en la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setBusqueda(params.get('buscar') || '');
  }, [location.search]);

  const handleBuscar = (e) => {
    e.preventDefault();
    const query = busqueda.trim();
    const params = new URLSearchParams(location.pathname === '/' ? location.search : '');

    if (query) {
      params.set('buscar', query);
    } else {
      params.delete('buscar');
    }

    if (location.pathname === '/') {
      const catalogo = document.getElementById('catalogo');
      if (catalogo) {
        catalogo.scrollIntoView({ behavior: 'smooth' });
      }
      navigate(`/?${params.toString()}`, { replace: true });
    } else {
      navigate(`/?${params.toString()}`);
    }
  };

  const limpiarBusqueda = () => {
    setBusqueda('');
    const params = new URLSearchParams(location.search);
    params.delete('buscar');
    if (location.pathname === '/') {
      navigate(`/?${params.toString()}`, { replace: true });
    }
  };

  const handleFiltrar = (categoria) => {
    const params = new URLSearchParams(location.pathname === '/' ? location.search : '');
    params.set('categoria', categoria);

    if (location.pathname === '/') {
      const catalogo = document.getElementById('catalogo');
      if (catalogo) {
        catalogo.scrollIntoView({ behavior: 'smooth' });
      }
      navigate(`/?${params.toString()}`, { replace: true });
    } else {
      navigate(`/?${params.toString()}`);
    }
  };

  return (
    <nav className="bg-white shadow-xs py-3.5 border-b border-pawSecondary sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-decoration-none shrink-0 group">
          <span className="text-3xl group-hover:scale-110 transition-transform">🐾</span>
          <div>
            <h1 className="m-0 text-2xl font-extrabold text-pawText tracking-tight leading-tight">PawtoPaw</h1>
          </div>
        </Link>

        {/* Búsqueda moderna integrada con la paleta de PawtoPaw */}
        <div className="hidden md:flex flex-1 max-w-xl mx-2 lg:mx-6">
          <form
            onSubmit={handleBuscar}
            className="flex w-full items-center bg-pawLight border border-pawSecondary hover:border-pawPrimary/70 focus-within:border-pawPrimary focus-within:ring-2 focus-within:ring-pawPrimary/20 rounded-full pl-4 pr-1.5 py-1.5 shadow-2xs transition-all"
          >
            <span className="text-pawPrimary text-base select-none mr-2">🔍</span>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar productos, alimentos, cuidadores..."
              className="w-full bg-transparent outline-none text-sm font-medium text-pawText placeholder-pawText/40"
            />
            {busqueda && (
              <button
                type="button"
                onClick={limpiarBusqueda}
                className="text-pawText/40 hover:text-pawText text-xs px-2 py-1 rounded-full hover:bg-pawSecondary/60 transition-colors mr-1 cursor-pointer"
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="bg-pawPrimary hover:bg-pawPrimary/90 text-white font-bold text-xs px-4 py-2 rounded-full transition-all shadow-xs shrink-0 cursor-pointer"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Enlaces de Usuario (Solo Íconos) */}
        <div className="flex items-center gap-5 text-pawText shrink-0">
          <button
            type="button"
            onClick={() => handleFiltrar('producto')}
            className="text-2xl hover:text-pawPrimary hover:scale-110 transition-all cursor-pointer bg-transparent border-0 p-0"
            title="Productos"
            aria-label="Productos"
          >
            🛍️
          </button>
          <button
            type="button"
            onClick={() => handleFiltrar('petsitter')}
            className="text-2xl hover:text-pawPrimary hover:scale-110 transition-all cursor-pointer bg-transparent border-0 p-0"
            title="Petsitters"
            aria-label="Petsitters"
          >
            🐕
          </button>
          
          <div className="flex gap-4 border-l border-pawPrimary/40 pl-4 items-center">
            <Link
              to={user ? "/perfil" : "/login"}
              className="text-2xl hover:text-pawPrimary hover:scale-110 transition-all cursor-pointer"
              title={user ? "Mi Perfil" : "Iniciar Sesión"}
            >
              👤
            </Link>
            <Link 
              to="/carrito" 
              className="text-2xl hover:text-pawPrimary hover:scale-110 transition-all relative cursor-pointer" 
              title="Mi Carrito de Compras"
            >
              🛒
              <span className="absolute -top-1.5 -right-2 bg-pawAccent text-pawText text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-extrabold shadow-xs">
                {cantidadTotalCarrito || 0}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}