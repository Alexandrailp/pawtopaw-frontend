import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://pawtopaw-backend.onrender.com';

export default function CrearPublicacion() {
  const [titulo, setTitulo] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [categoria, setCategoria] = useState('1'); // 1: Producto, 2: Petsitter
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !precio || !imagen || !descripcion) {
      return alert('Completa todos los campos');
    }

    try {
      setLoading(true);
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
          tipo_id: Number(categoria),
          descripcion
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al crear la publicación');
      }

      alert('¡Publicación creada con éxito!');
      navigate('/');
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
          <input
            type="text"
            placeholder="título del producto o servicio"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full bg-pawLight border border-pawPrimary rounded-full px-6 py-3.5 text-center text-pawText placeholder-pawText/60 outline-none focus:ring-2 focus:ring-pawAccent transition-all"
          />

          <input
            type="number"
            placeholder="precio ($CLP)"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="w-full bg-pawLight border border-pawPrimary rounded-full px-6 py-3.5 text-center text-pawText placeholder-pawText/60 outline-none focus:ring-2 focus:ring-pawAccent transition-all"
          />

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full bg-pawLight border border-pawPrimary rounded-full px-6 py-3.5 text-center text-pawText outline-none focus:ring-2 focus:ring-pawAccent transition-all"
          >
            <option value="1">Producto</option>
            <option value="2">Petsitter / Servicio</option>
          </select>

          <input
            type="text"
            placeholder="URL de la imagen (ej: https://...)"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
            className="w-full bg-pawLight border border-pawPrimary rounded-full px-6 py-3.5 text-center text-pawText placeholder-pawText/60 outline-none focus:ring-2 focus:ring-pawAccent transition-all"
          />

          <textarea
            placeholder="descripción detallada"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
            className="w-full bg-pawLight border border-pawPrimary rounded-2xl px-6 py-3.5 text-center text-pawText placeholder-pawText/60 outline-none focus:ring-2 focus:ring-pawAccent transition-all resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pawPrimary text-white font-bold py-3.5 rounded-full hover:opacity-90 transition-opacity shadow-sm mt-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Publicando...' : 'Publicar Anuncio'}
          </button>
        </form>
      </div>
    </div>
  );
}