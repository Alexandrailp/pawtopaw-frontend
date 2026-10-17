import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Card from '../components/Card';

const misPedidos = [
  {
    id: 101,
    titulo: 'Alimento Premium 10kg',
    precio: 35000,
    fecha: '12 Oct 2026',
    estado: 'Entregado',
    imagen: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500'
  },
  {
    id: 102,
    titulo: 'Juguete Cuerda Resistente',
    precio: 8000,
    fecha: '15 Oct 2026',
    estado: 'En camino',
    imagen: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=500'
  }
];

const misPublicaciones = [
  {
    id: 1,
    titulo: 'Paseo de Perros 1 hr',
    precio: 5000,
    imagen: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=500',
    estrellas: 5,
    cantidad: 42
  },
  {
    id: 2,
    titulo: 'Casa para Gato',
    precio: 15000,
    imagen: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500',
    estrellas: 4,
    cantidad: 18
  }
];

export default function Perfil() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const nombreMostrado =
    user?.nombre || (user?.email ? user.email.split('@')[0] : 'Camila Rojas');

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <aside className="w-full md:w-80 shrink-0 bg-white border border-pawSecondary rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full bg-pawSecondary border-4 border-pawAccent flex items-center justify-center mb-4 shadow-xs overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300"
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full bg-pawLight border border-pawPrimary/50 rounded-full py-2.5 px-4 mb-2">
            <h2 className="text-lg font-extrabold text-pawText capitalize truncate">
              {nombreMostrado}
            </h2>
          </div>

          <p className="text-sm text-pawText/70 font-medium mb-6">
            {user?.email || 'camila@pawtopaw.cl'}
          </p>

          <div className="w-full flex flex-col gap-3 border-t border-pawSecondary pt-6">
            <button className="w-full bg-pawSecondary text-pawText font-bold py-3 rounded-full hover:bg-pawAccent transition-colors text-sm cursor-pointer">
              Editar perfil
            </button>
            <button className="w-full bg-pawLight border border-pawSecondary text-pawText font-semibold py-3 rounded-full hover:bg-pawSecondary/50 transition-colors text-sm cursor-pointer">
              Mis favoritos
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-pawPrimary text-white font-bold py-3 rounded-full hover:opacity-90 transition-opacity text-sm mt-2 cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        <div className="flex-1 w-full flex flex-col gap-8">
          <section className="w-full bg-white border border-pawSecondary rounded-3xl p-8 shadow-sm">
            <div className="pb-6 mb-6 border-b border-pawSecondary">
              <h3 className="text-2xl font-extrabold text-pawText">Mis Pedidos</h3>
              <p className="text-sm text-pawText/70 mt-1">
                Productos y servicios que has comprado recientemente
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {misPedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  className="flex items-center gap-4 bg-pawLight border border-pawSecondary rounded-2xl p-4 hover:shadow-xs transition-all"
                >
                  <div className="w-20 h-20 bg-white rounded-xl p-2 shrink-0 flex items-center justify-center border border-pawSecondary">
                    <img
                      src={pedido.imagen}
                      alt={pedido.titulo}
                      className="max-h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block bg-pawAccent text-pawText text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1">
                      {pedido.estado}
                    </span>
                    <h4 className="font-bold text-pawText text-sm truncate">
                      {pedido.titulo}
                    </h4>
                    <p className="font-extrabold text-pawText text-base mt-0.5">
                      ${pedido.precio.toLocaleString('es-CL')}
                    </p>
                    <p className="text-xs text-pawText/60 mt-0.5">
                      Comprado el {pedido.fecha}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="w-full bg-white border border-pawSecondary rounded-3xl p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 mb-8 border-b border-pawSecondary">
              <div>
                <h3 className="text-2xl font-extrabold text-pawText">Mis Publicaciones</h3>
                <p className="text-sm text-pawText/70 mt-1">
                  Gestiona tus productos y servicios de petsitter activos
                </p>
              </div>
              <button className="bg-pawAccent text-pawText font-bold px-6 py-3 rounded-full hover:bg-pawPrimary hover:text-white transition-colors shadow-xs text-sm cursor-pointer">
                + Nueva publicación
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {misPublicaciones.map((pub) => (
                <Card
                  key={pub.id}
                  titulo={pub.titulo}
                  precio={pub.precio}
                  imagen={pub.imagen}
                  estrellas={pub.estrellas}
                  cantidad={pub.cantidad}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}