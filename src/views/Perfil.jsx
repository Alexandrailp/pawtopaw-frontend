import { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Card from '../components/Card';

export default function Perfil() {
  const { user, setUser, publicaciones, eliminarPublicacion, favoritos, toggleFavorito } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const nombreMostrado =
    user?.nombre || (user?.email ? user.email.split('@')[0] : 'Usuario');

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const handleEliminar = async (id, titulo) => {
    const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar la publicación "${titulo}"?`);
    if (confirmar) {
      await eliminarPublicacion(id);
      alert('¡Publicación eliminada con éxito!');
    }
  };

  // Pedidos del usuario actual
  const pedidosKey = user?.id 
    ? `pawtopaw_pedidos_${user.id}` 
    : (user?.email ? `pawtopaw_pedidos_${user.email}` : null);
  const pedidosUsuario = pedidosKey 
    ? JSON.parse(localStorage.getItem(pedidosKey) || '[]') 
    : [];

  // Limpiar clave global antigua si existiera en el navegador
  useEffect(() => {
    try {
      localStorage.removeItem('pawtopaw_mis_articulos');
    } catch {}
  }, []);

  // Publicaciones creadas exclusivamente por el usuario actual
  const clavesArticulos = [
    user?.id ? `pawtopaw_articulos_usuario_${user.id}` : null,
    user?.email ? `pawtopaw_articulos_usuario_${user.email}` : null
  ].filter(Boolean);

  let misArticulosIds = [];
  clavesArticulos.forEach((key) => {
    try {
      const items = JSON.parse(localStorage.getItem(key) || '[]');
      misArticulosIds = [...misArticulosIds, ...items];
    } catch {}
  });

  const publicacionesDelUsuario = user
    ? publicaciones.filter((p) => {
        // Los artículos 1 a 6 son productos base del catálogo de la plataforma y nunca pertenecen a usuarios nuevos
        if (Number(p.id) >= 1 && Number(p.id) <= 6) {
          return false;
        }

        const coincideEmail = Boolean(
          user?.email &&
          p?.usuario_email &&
          user.email.trim().toLowerCase() === p.usuario_email.trim().toLowerCase()
        );

        const coincideId = Boolean(
          !p?.usuario_email &&
          user?.id &&
          p?.usuario_id &&
          Number(user.id) === Number(p.usuario_id)
        );

        const coincideLocal = misArticulosIds.some((id) => Number(id) === Number(p.id));
        return coincideEmail || coincideId || coincideLocal;
      })
    : [];

  const listaFavoritos = favoritos || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <aside className="w-full md:w-80 shrink-0 bg-white border border-pawSecondary rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full bg-pawSecondary border-4 border-pawAccent flex items-center justify-center mb-4 shadow-xs overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-extrabold text-pawText uppercase">
                {(nombreMostrado || 'P')[0]}
              </span>
            )}
          </div>

          <div className="w-full bg-pawLight border border-pawPrimary/50 rounded-full py-2.5 px-4 mb-2">
            <h2 className="text-lg font-extrabold text-pawText capitalize truncate">
              {nombreMostrado}
            </h2>
          </div>

          <p className="text-sm text-pawText/70 font-medium mb-6">
            {user?.email || 'sin-correo@pawtopaw.cl'}
          </p>

          <div className="w-full flex flex-col gap-3 border-t border-pawSecondary pt-6">
            <Link
              to="/editar-perfil"
              className="w-full bg-pawSecondary text-pawText font-bold py-3 rounded-full hover:bg-pawAccent transition-colors text-sm cursor-pointer"
            >
              Editar perfil
            </Link>
            <button
              onClick={handleLogout}
              className="w-full bg-pawPrimary text-white font-bold py-3 rounded-full hover:opacity-90 transition-opacity text-sm mt-2 cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        <div className="flex-1 w-full flex flex-col gap-8">
          {/* SECCIÓN 1: MIS PEDIDOS */}
          <section className="w-full bg-white border border-pawSecondary rounded-3xl p-8 shadow-sm">
            <div className="pb-6 mb-6 border-b border-pawSecondary">
              <h3 className="text-2xl font-extrabold text-pawText">Mis Pedidos</h3>
              <p className="text-sm text-pawText/70 mt-1">
                Productos y servicios que has comprado recientemente
              </p>
            </div>

            {pedidosUsuario.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pedidosUsuario.map((pedido) => (
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
                        {pedido.estado || 'En camino'}
                      </span>
                      <h4 className="font-bold text-pawText text-sm truncate">
                        {pedido.titulo}
                      </h4>
                      <p className="font-extrabold text-pawText text-base mt-0.5">
                        ${(pedido.precio || 0).toLocaleString('es-CL')}
                      </p>
                      <p className="text-xs text-pawText/60 mt-0.5">
                        Comprado el {pedido.fecha || 'Recientemente'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-pawLight/50 border border-dashed border-pawSecondary rounded-2xl p-8 text-center">
                <p className="text-sm text-pawText/70 font-medium">
                  Aún no tienes pedidos registrados.
                </p>
              </div>
            )}
          </section>

          {/* SECCIÓN 2: MIS PUBLICACIONES (CON EDITAR Y ELIMINAR) */}
          <section className="w-full bg-white border border-pawSecondary rounded-3xl p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 mb-8 border-b border-pawSecondary">
              <div>
                <h3 className="text-2xl font-extrabold text-pawText">Mis Publicaciones</h3>
                <p className="text-sm text-pawText/70 mt-1">
                  Gestiona tus productos y servicios de petsitter activos
                </p>
              </div>
              <Link
                to="/crear-publicacion"
                className="bg-pawAccent text-pawText font-bold px-6 py-3 rounded-full hover:bg-pawPrimary hover:text-white transition-colors shadow-xs text-sm cursor-pointer"
              >
                + Nueva publicación
              </Link>
            </div>

            {publicacionesDelUsuario.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicacionesDelUsuario.map((pub) => (
                  <div key={pub.id} className="flex flex-col">
                    <Card
                      id={pub.id}
                      titulo={pub.titulo}
                      precio={pub.precio}
                      imagen={pub.imagen}
                      estrellas={pub.estrellas || 5}
                      cantidad={pub.cantidad || 1}
                      categoria={pub.categoria}
                    />
                    <div className="flex gap-2 mt-2">
                      <Link
                        to={`/editar-publicacion/${pub.id}`}
                        className="flex-1 bg-pawSecondary hover:bg-pawAccent text-pawText font-bold py-2 rounded-xl text-center text-xs transition-colors flex items-center justify-center gap-1 shadow-xs"
                      >
                        ✏️ Editar
                      </Link>
                      <button
                        onClick={() => handleEliminar(pub.id, pub.titulo)}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 rounded-xl text-center text-xs transition-colors cursor-pointer flex items-center justify-center gap-1 border border-red-200 shadow-xs"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-pawLight/50 border border-dashed border-pawSecondary rounded-2xl p-8 text-center">
                <p className="text-sm text-pawText/70 font-medium">
                  Aún no has creado ninguna publicación.
                </p>
              </div>
            )}
          </section>

          {/* SECCIÓN 3: MIS FAVORITOS */}
          <section className="w-full bg-white border border-pawSecondary rounded-3xl p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 mb-8 border-b border-pawSecondary">
              <div>
                <h3 className="text-2xl font-extrabold text-pawText flex items-center gap-2">
                  Mis Favoritos <span className="text-red-500 text-xl">♥</span>
                </h3>
                <p className="text-sm text-pawText/70 mt-1">
                  Publicaciones y cuidadores que has guardado en tus favoritos
                </p>
              </div>
              <span className="bg-pawAccent text-pawText font-bold text-xs px-3.5 py-1.5 rounded-full">
                {listaFavoritos.length} {listaFavoritos.length === 1 ? 'guardado' : 'guardados'}
              </span>
            </div>

            {listaFavoritos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listaFavoritos.map((pub) => (
                  <div key={pub.id} className="flex flex-col">
                    <Card
                      id={pub.id}
                      titulo={pub.titulo}
                      precio={pub.precio}
                      imagen={pub.imagen}
                      estrellas={pub.estrellas || 5}
                      cantidad={pub.cantidad || 1}
                      categoria={pub.categoria}
                    />
                    <button
                      onClick={() => toggleFavorito(pub)}
                      className="mt-2 w-full bg-pawSecondary hover:bg-red-50 hover:text-red-600 text-pawText font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      ✕ Quitar de favoritos
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-pawLight/50 border border-dashed border-pawSecondary rounded-2xl p-8 text-center">
                <p className="text-sm text-pawText/70 font-medium">
                  Aún no tienes publicaciones guardadas en tus favoritos.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}