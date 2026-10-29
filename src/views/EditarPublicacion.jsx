import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function EditarPublicacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { publicaciones, actualizarPublicacion } = useContext(UserContext);

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('producto');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pub = publicaciones.find((p) => Number(p.id) === Number(id));
    if (pub) {
      setTitulo(pub.titulo || '');
      setCategoria(pub.categoria || (pub.tipo_id === 2 ? 'petsitter' : 'producto'));
      setPrecio(pub.precio || '');
      setImagen(pub.imagen || '');
      setDescripcion(pub.descripcion || '');
    }
  }, [id, publicaciones]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !precio || !imagen || !descripcion) {
      return alert('Completa todos los campos');
    }

    try {
      setLoading(true);
      await actualizarPublicacion(id, {
        titulo,
        precio: Number(precio),
        imagen,
        categoria,
        descripcion
      });
      alert('¡Publicación actualizada con éxito!');
      navigate('/perfil');
    } catch (err) {
      alert(err.message || 'Error al actualizar la publicación');
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
          Editar Publicación
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
            {loading ? 'Guardando...' : 'Guardar Cambios'}
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
