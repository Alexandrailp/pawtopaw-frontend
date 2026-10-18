import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleFiltrar = (categoria) => {
    if (location.pathname === '/') {
      const catalogo = document.getElementById('catalogo');
      if (catalogo) {
        catalogo.scrollIntoView({ behavior: 'smooth' });
      }
      navigate(`/?categoria=${categoria}`, { replace: true });
    } else {
      navigate(`/?categoria=${categoria}`);
    }
  };

  return (
    <nav className="bg-white shadow-sm py-4 border-b border-pawSecondary">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-decoration-none">
          <span className="text-3xl">🐾</span>
          <div>
            <h1 className="m-0 text-2xl font-bold text-pawText leading-tight">PawtoPaw</h1>
          </div>
        </Link>

        {/* Búsqueda */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="flex w-full bg-pawSecondary rounded-full overflow-hidden border border-pawPrimary focus-within:ring-1 focus-within:ring-pawPrimary transition-all">
            <input
              type="text"
              placeholder="Busca productos, alimentos o cuidadores..."
              className="w-full bg-transparent px-5 py-2 outline-none text-sm text-pawText placeholder-pawPrimary"
            />
            <button className="bg-pawPrimary px-6 text-pawText hover:bg-opacity-80 transition-colors flex items-center justify-center">
              🔍
            </button>
          </div>
        </div>

        {/* Enlaces de Usuario (Solo Íconos) */}
        <div className="flex items-center gap-6 text-pawText">
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
          
          <div className="flex gap-4 border-l border-pawPrimary pl-4">
            <Link to="/login" className="text-2xl hover:text-pawPrimary transition-colors" title="Cuenta">👤</Link>
            <Link to="/perfil" className="text-2xl hover:text-pawPrimary transition-colors relative" title="Carrito">
              🛒
              <span className="absolute -top-2 -right-2 bg-pawAccent text-pawText text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">0</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}