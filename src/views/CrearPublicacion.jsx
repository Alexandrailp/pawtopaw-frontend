import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://pawtopaw-backend.onrender.com';

export default function CrearPublicacion() {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('producto');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, token, obtenerArticulos } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !precio || !imagen || !descripcion) {
      return alert('Completa todos los campos');
    }

    try {
      setLoading(true);
      const tipo_id = categoria === 'petsitter' ? 2 : 1;
      const response = await fetch(`${API_URL}/articulos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          titulo,
          precio: Number(precio),
          imagen,
          tipo_id,
          usuario_id: user?.id || 1,
          descripcion
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al crear la publicación');
      }

      if (data.articulo_id) {
        const userKey = user?.id 
          ? `pawtopaw_articulos_usuario_${user.id}` 
          : (user?.email ? `pawtopaw_articulos_usuario_${user.email}` : 'pawtopaw_mis_articulos');
        const guardados = JSON.parse(localStorage.getItem(userKey) || '[]');
        if (!guardados.includes(data.articulo_id)) {
          localStorage.setItem(userKey, JSON.stringify([data.articulo_id, ...guardados]));
        }
      }

      alert('¡Publicación creada con éxito!');
      if (obtenerArticulos) {
        await obtenerArticulos();
      }
      navigate('/perfil');
    } catch (err) {
      alert(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-repeat bg-[size:350px]"
      style={{ backgroundImage: "url('/bg-doodles.jpg')" }}
    >
      <div className="w-full max-w-lg bg-white border border-pawSecondary rounded-3xl p-8 md:p-10 shadow-lg flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-pawText mb-8 text-center">
          Nueva Publicación
        </h2>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex gap-3 mb-2">
            <button
              type="button"
              onClick={() => setCategoria('producto')}
              className={`flex-1 py-3 rounded-full font-bold text-sm transition-colors cursor-pointer ${
                categoria === 'producto'
                  ? 'bg-pawPrimary text-white shadow-xs'
                  : 'bg-pawLight border border-pawPrimary/50 text-pawText'
              }`}
            >
              🛍️ Producto
            </button>
            <button
              type="button"
              onClick={() => setCategoria('petsitter')}
              className={`flex-1 py-3 rounded-full font-bold text-sm transition-colors cursor-pointer ${
                categoria === 'petsitter'
                  ? 'bg-pawPrimary text-white shadow-xs'
                  : 'bg-pawLight border border-pawPrimary/50 text-pawText'
              }`}
            >
              🐕 Petsitter
            </button>
          </div>

          <input
            type="text"
            placeholder="título de la publicación"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full bg-pawLight border border-pawPrimary rounded-full px-6 py-3.5 text-center text-pawText placeholder-pawText/60 outline-none focus:ring-2 focus:ring-pawAccent transition-all"
          />

          <input
            type="number"
            placeholder="precio ($)"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="w-full bg-pawLight border border-pawPrimary rounded-full px-6 py-3.5 text-center text-pawText placeholder-pawText/60 outline-none focus:ring-2 focus:ring-pawAccent transition-all"
          />

          <input
            type="url"
            placeholder="url de la imagen"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
            className="w-full bg-pawLight border border-pawPrimary rounded-full px-6 py-3.5 text-center text-pawText placeholder-pawText/60 outline-none focus:ring-2 focus:ring-pawAccent transition-all"
          />

          <textarea
            rows="4"
            placeholder="descripción detallada..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full bg-pawLight border border-pawPrimary rounded-3xl px-6 py-3.5 text-center text-pawText placeholder-pawText/60 outline-none focus:ring-2 focus:ring-pawAccent transition-all resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pawPrimary text-white font-bold py-3.5 rounded-full hover:opacity-90 transition-opacity shadow-sm mt-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Publicando...' : 'Publicar'}
          </button>
        </form>

        <Link
          to="/perfil"
          className="w-full mt-4 bg-pawAccent text-pawText text-sm font-bold py-3.5 rounded-full hover:bg-pawSecondary transition-colors text-center shadow-xs"
        >
          Cancelar y volver al perfil
        </Link>
      </div>
    </div>
  );
}