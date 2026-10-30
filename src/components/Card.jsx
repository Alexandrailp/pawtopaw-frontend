import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Card({ id, titulo, precio, imagen, estrellas, cantidad, categoria }) {
  const { agregarAlCarrito } = useContext(UserContext);
  const [agregado, setAgregado] = useState(false);

  const handleAgregar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (agregarAlCarrito) {
      agregarAlCarrito({ id, titulo, precio, imagen, categoria });
      setAgregado(true);
      setTimeout(() => setAgregado(false), 2000);
    }
  };

  return (
    <Link
      to={`/publicacion/${id || 1}`}
      className="bg-white rounded-2xl shadow-sm border border-pawSecondary overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer text-decoration-none group"
    >
      <div className="h-52 bg-pawLight flex justify-center items-center p-4 relative">
        <img src={imagen} alt={titulo} className="max-h-full object-contain mix-blend-multiply rounded-xl group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-5 flex flex-col flex-1 justify-between gap-2">
        <h3 className="font-bold text-pawText text-base leading-snug line-clamp-2">{titulo}</h3>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="font-extrabold text-xl text-pawText">
              ${(precio || 0).toLocaleString('es-CL')}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-amber-400 text-sm tracking-wider">
                {'★'.repeat(Math.min(5, Math.max(1, estrellas || 5)))}{'☆'.repeat(5 - Math.min(5, Math.max(1, estrellas || 5)))}
              </span>
              <span className="text-xs text-pawText/70 font-semibold">({cantidad || 1})</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAgregar}
            className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center text-sm shadow-2xs ${
              agregado ? 'bg-emerald-500 text-white scale-110' : 'bg-pawLight hover:bg-pawAccent border border-pawSecondary text-pawText'
            }`}
            title="Agregar al carrito"
          >
            {agregado ? '✓' : '🛒'}
          </button>
        </div>
      </div>
    </Link>
  );
}