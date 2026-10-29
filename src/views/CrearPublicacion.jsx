import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const CrearPublicacion = () => {
  const [titulo, setTitulo] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [categoria, setCategoria] = useState('producto');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState(10);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { agregarPublicacion } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!titulo || !precio || !imagen || !descripcion) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    try {
      setLoading(true);
      await agregarPublicacion({
        titulo,
        precio: Number(precio),
        imagen,
        categoria,
        descripcion,
        cantidad: Number(cantidad)
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al crear la publicación en el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Nueva Publicación PawtoPaw</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título del Artículo / Servicio</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="Ej: Paseo canino 1 hora"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($CLP)</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="5000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo / Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="producto">Producto</option>
              <option value="petsitter">Petsitter / Servicio</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen</label>
          <input
            type="text"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Detallada</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="Detalles sobre el producto o servicio ofrecido..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {loading ? 'Publicando...' : 'Publicar Anuncio'}
        </button>
      </form>
    </div>
  );
};

export default CrearPublicacion;