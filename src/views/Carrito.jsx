import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Carrito() {
  const {
    user,
    carrito,
    eliminarDelCarrito,
    actualizarCantidadCarrito,
    vaciarCarrito,
    totalCarrito,
    cantidadTotalCarrito,
    finalizarCompra
  } = useContext(UserContext);

  const navigate = useNavigate();

  const handleComprar = async () => {
    if (!user) {
      const irALogin = window.confirm(
        'Para confirmar tu pedido debes iniciar sesión. ¿Deseas ir a Iniciar Sesión ahora?'
      );
      if (irALogin) {
        navigate('/login');
      }
      return;
    }

    try {
      const exito = await finalizarCompra();
      if (exito) {
        alert('¡Felicitaciones! Tu pedido fue registrado exitosamente. Puedes revisarlo en tu perfil.');
        navigate('/perfil');
      }
    } catch (e) {
      alert('Hubo un inconveniente al procesar tu compra. Por favor intenta nuevamente.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-pawText flex items-center gap-3">
            Mi Carrito <span>🛒</span>
          </h1>
          <p className="text-sm text-pawText/70 mt-1">
            {user ? (
              <>
                Comprando como <span className="font-bold text-pawText">{user.nombre || user.email}</span>
              </>
            ) : (
              'Revisa tus productos y servicios seleccionados antes de comprar'
            )}
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-pawText font-bold text-sm hover:text-pawPrimary transition-colors w-max"
        >
          ❮ Seguir explorando productos
        </Link>
      </div>

      {carrito.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Lista de productos */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white border border-pawSecondary rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-pawSecondary">
                <span className="text-sm font-bold text-pawText">
                  {cantidadTotalCarrito} {cantidadTotalCarrito === 1 ? 'artículo' : 'artículos'} en tu carrito
                </span>
                <button
                  onClick={() => {
                    if (window.confirm('¿Seguro que deseas vaciar tu carrito?')) {
                      vaciarCarrito();
                    }
                  }}
                  className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors cursor-pointer"
                >
                  Vaciar carrito
                </button>
              </div>

              <div className="flex flex-col divide-y divide-pawSecondary">
                {carrito.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-center">
                    <div className="w-24 h-24 bg-pawLight border border-pawSecondary rounded-2xl p-2 shrink-0 flex items-center justify-center">
                      <img
                        src={item.imagen}
                        alt={item.titulo}
                        className="max-h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <span className="inline-block bg-pawAccent text-pawText text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                        {item.categoria}
                      </span>
                      <h3 className="font-bold text-pawText text-base truncate">
                        {item.titulo}
                      </h3>
                      <p className="text-xs text-pawText/70 mt-0.5">
                        Precio unitario: ${(item.precio || 0).toLocaleString('es-CL')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-pawSecondary rounded-full bg-pawLight overflow-hidden">
                        <button
                          onClick={() => actualizarCantidadCarrito(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center text-pawText font-bold hover:bg-pawSecondary transition-colors cursor-pointer"
                          title="Disminuir"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-pawText">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => actualizarCantidadCarrito(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center text-pawText font-bold hover:bg-pawSecondary transition-colors cursor-pointer"
                          title="Aumentar"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-extrabold text-pawText text-base min-w-[80px] text-right">
                        ${((item.precio || 0) * (item.cantidad || 1)).toLocaleString('es-CL')}
                      </span>

                      <button
                        onClick={() => eliminarDelCarrito(item.id)}
                        className="text-red-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer text-lg"
                        title="Eliminar del carrito"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="w-full">
            <div className="bg-white border border-pawSecondary rounded-3xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-extrabold text-pawText pb-4 mb-4 border-b border-pawSecondary">
                Resumen del Pedido
              </h2>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-pawText/80">
                  <span>Subtotal</span>
                  <span className="font-bold text-pawText">
                    ${totalCarrito.toLocaleString('es-CL')}
                  </span>
                </div>
                <div className="flex justify-between text-pawText/80">
                  <span>Envío estimado</span>
                  <span className="font-bold text-green-600">Gratis</span>
                </div>

                <div className="border-t border-pawSecondary pt-3 mt-1 flex justify-between items-baseline">
                  <span className="text-base font-extrabold text-pawText">Total</span>
                  <span className="text-2xl font-black text-pawPrimary">
                    ${totalCarrito.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleComprar}
                className="w-full bg-pawPrimary text-white font-extrabold py-4 rounded-full mt-6 hover:opacity-90 hover:scale-[1.02] transition-all shadow-md cursor-pointer text-base"
              >
                {user ? 'Confirmar y pagar pedido' : 'Iniciar sesión para pagar'}
              </button>

              {!user && (
                <p className="text-xs text-center text-pawText/60 mt-3 font-medium">
                  Inicia sesión para registrar este pedido directamente en tu cuenta.
                </p>
              )}

              <div className="mt-6 pt-6 border-t border-pawSecondary flex items-center justify-center gap-2 text-xs text-pawText/60 font-semibold">
                <span>🔒 Compra 100% segura con PawtoPaw</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-dashed border-pawSecondary rounded-3xl p-16 text-center flex flex-col items-center justify-center max-w-2xl mx-auto shadow-sm">
          <span className="text-6xl mb-4">🛒</span>
          <h2 className="text-2xl font-extrabold text-pawText">Tu carrito está vacío</h2>
          <p className="text-sm text-pawText/70 mt-2 max-w-md">
            Parece que aún no has agregado ningún producto o servicio a tu carrito de compras.
          </p>
          <Link
            to="/"
            className="mt-8 bg-pawPrimary text-white font-bold py-3.5 px-8 rounded-full hover:opacity-90 hover:scale-105 transition-all shadow-sm text-sm"
          >
            Explorar catálogo de productos
          </Link>
        </div>
      )}
    </div>
  );
}
