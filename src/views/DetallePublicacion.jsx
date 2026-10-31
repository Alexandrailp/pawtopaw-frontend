import { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const publicaciones = [
  { id: 1, categoria: 'petsitter', titulo: 'Paseo de Perros 1 hr', precio: 5000, imagen: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800', estrellas: 5, cantidad: 42, vendedor: 'Martín Soto', descripcion: 'Paseos seguros, entretenidos y personalizados por parques de la zona. Incluye hidratación, reporte con fotos en tiempo real y mucha dedicación para que tu perro gaste energía de forma saludable.' },
  { id: 2, categoria: 'producto', titulo: 'Casa para Gato', precio: 15000, imagen: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800', estrellas: 4, cantidad: 18, vendedor: 'Tienda MascotaFeliz', descripcion: 'Casa acolchada y térmica ideal para el descanso felino. Fabricada con telas suaves de fácil lavado y base antideslizante.' },
  { id: 3, categoria: 'producto', titulo: 'Alimento Premium 10kg', precio: 35000, imagen: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800', estrellas: 5, cantidad: 64, vendedor: 'NutriPet Chile', descripcion: 'Fórmula balanceada libre de granos, rica en proteínas de alta calidad, omega 3 y vitaminas esenciales para mantener el pelaje brillante y una digestión óptima.' },
  { id: 4, categoria: 'petsitter', titulo: 'Cuidado a domicilio (Día)', precio: 20000, imagen: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800', estrellas: 5, cantidad: 31, vendedor: 'Valentina Muñoz', descripcion: 'Cuido a tu mascota en la comodidad de tu hogar para evitarle el estrés del traslado. Incluye alimentación en sus horarios, limpieza, juegos y paseos incluidos.' },
  { id: 5, categoria: 'producto', titulo: 'Juguete Cuerda Resistente', precio: 8000, imagen: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=800', estrellas: 4, cantidad: 12, vendedor: 'Tienda MascotaFeliz', descripcion: 'Juguete de algodón trenzado de alta resistencia, ideal para perros que disfrutan morder y jugar a tirar. Ayuda a limpiar los dientes de forma natural.' },
  { id: 6, categoria: 'petsitter', titulo: 'Guardería Diurna Felina', precio: 12000, imagen: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800', estrellas: 5, cantidad: 27, vendedor: 'Carolina Díaz', descripcion: 'Espacio tranquilo, seguro y enriquecido con rascadores y zonas altas para el cuidado diurno de gatitos. Atención personalizada y ambiente libre de estrés.' }
];

const descripcionesEstrellas = {
  1: '😞 1 estrella - Muy insatisfecho',
  2: '🙁 2 estrellas - Regular',
  3: '😐 3 estrellas - Bueno',
  4: '🙂 4 estrellas - Muy bueno',
  5: '🤩 5 estrellas - ¡Excelente, lo recomiendo!'
};

export default function DetallePublicacion() {
  const { id } = useParams();
  const {
    user,
    publicaciones: publicacionesBackend,
    toggleFavorito,
    esFavorito,
    agregarAlCarrito,
    obtenerResenasArticulo,
    calificarArticulo
  } = useContext(UserContext);

  const [agregadoReciente, setAgregadoReciente] = useState(false);
  const [resenas, setResenas] = useState([]);
  const [cargandoResenas, setCargandoResenas] = useState(true);

  // Estados del formulario de valoración
  const [calificacionSeleccionada, setCalificacionSeleccionada] = useState(5);
  const [hoverCalificacion, setHoverCalificacion] = useState(0);
  const [comentarioTexto, setComentarioTexto] = useState('');
  const [nombreInvitado, setNombreInvitado] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const listaCompleta = (publicacionesBackend && publicacionesBackend.length > 0)
    ? publicacionesBackend
    : publicaciones;

  const publicacion =
    listaCompleta.find((p) => Number(p.id) === Number(id)) ||
    publicaciones.find((p) => Number(p.id) === Number(id)) ||
    listaCompleta[0] ||
    publicaciones[0];

  const esArticuloBase = Number(publicacion.id) >= 1 && Number(publicacion.id) <= 6;

  const coincideEmail = Boolean(
    user?.email &&
    publicacion?.usuario_email &&
    user.email.trim().toLowerCase() === publicacion.usuario_email.trim().toLowerCase()
  );

  const coincideId = Boolean(
    !publicacion?.usuario_email &&
    user?.id &&
    publicacion?.usuario_id &&
    Number(user.id) === Number(publicacion.usuario_id)
  );

  const esMiPublicacion = Boolean(user && !esArticuloBase && (coincideEmail || coincideId));

  const estaEnFavoritos = esFavorito ? esFavorito(publicacion.id) : false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Cargar reseñas para este artículo
  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      setCargandoResenas(true);
      if (obtenerResenasArticulo && publicacion?.id) {
        const data = await obtenerResenasArticulo(publicacion.id);
        if (activo) {
          setResenas(data);
          setCargandoResenas(false);
        }
      } else {
        if (activo) setCargandoResenas(false);
      }
    };
    cargar();
    return () => {
      activo = false;
    };
  }, [publicacion?.id, obtenerResenasArticulo]);

  // Cálculos de valoraciones dinámicas
  const totalResenas = resenas.length;
  const promedioEstrellas = totalResenas > 0
    ? (resenas.reduce((acc, r) => acc + (Number(r.calificacion) || 5), 0) / totalResenas).toFixed(1)
    : (publicacion.cantidad > 0 ? (publicacion.estrellas || 5).toFixed(1) : '0.0');

  const desgloseEstrellas = [5, 4, 3, 2, 1].map((n) => {
    const cuenta = resenas.filter((r) => Math.round(Number(r.calificacion)) === n).length;
    const porcentaje = totalResenas > 0 ? Math.round((cuenta / totalResenas) * 100) : 0;
    return { estrellas: n, cuenta, porcentaje };
  });

  const handleSubmitResena = async (e) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    if (!comentarioTexto.trim()) {
      setMensajeError('Por favor escribe tu opinión antes de enviar.');
      return;
    }

    try {
      setEnviando(true);
      const nueva = await calificarArticulo({
        articulo_id: publicacion.id,
        calificacion: calificacionSeleccionada,
        comentario: comentarioTexto,
        nombreAutor: nombreInvitado
      });

      setResenas((prev) => [nueva, ...prev]);
      setComentarioTexto('');
      setMensajeExito(`¡Muchas gracias! Tu valoración de ${calificacionSeleccionada} estrellas ha sido registrada con éxito.`);
      setTimeout(() => setMensajeExito(''), 7000);
    } catch (err) {
      setMensajeError(err.message || 'Error al guardar tu valoración.');
    } finally {
      setEnviando(false);
    }
  };

  const estrellasActivas = hoverCalificacion || calificacionSeleccionada;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      {/* Botón Volver */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-pawText font-bold text-sm hover:text-pawPrimary transition-colors"
      >
        ❮ Volver al catálogo
      </Link>

      {/* Tarjeta Principal del Producto */}
      <div className="bg-white border border-pawSecondary rounded-3xl p-6 md:p-10 shadow-sm flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2 bg-pawLight rounded-2xl p-6 flex items-center justify-center border border-pawSecondary min-h-[340px]">
          <img
            src={publicacion.imagen}
            alt={publicacion.titulo}
            className="max-h-96 w-full object-contain rounded-xl mix-blend-multiply"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <span className="inline-block bg-pawAccent text-pawText text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider mb-3">
              {publicacion.categoria}
            </span>

            <h1 className="text-3xl md:text-4xl font-extrabold text-pawText leading-tight">
              {publicacion.titulo}
            </h1>

            {/* Enlace de estrellas interactivo hacia la sección de reseñas */}
            <a
              href="#seccion-resenas"
              className="inline-flex items-center gap-2.5 mt-3 group cursor-pointer"
              title="Ver opiniones y reseñas"
            >
              <div className="flex text-amber-400 text-lg">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i}>
                    {totalResenas > 0 && i <= Math.round(Number(promedioEstrellas)) ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <span className="text-sm font-extrabold text-pawText group-hover:text-pawPrimary group-hover:underline underline-offset-4 transition-all">
                {totalResenas > 0
                  ? `${promedioEstrellas} (${totalResenas} ${totalResenas === 1 ? 'valoración' : 'valoraciones'})`
                  : 'Sin valoraciones aún (0)'}
              </span>
            </a>

            <p className="text-3xl font-extrabold text-pawText mt-6">
              ${(publicacion.precio || 0).toLocaleString('es-CL')}
            </p>

            <div className="border-t border-pawSecondary my-6 pt-6">
              <h3 className="font-bold text-pawText text-base mb-2">Descripción</h3>
              <p className="text-pawText/80 text-sm leading-relaxed">
                {publicacion.descripcion || 'Publicación oficial en PawtoPaw.'}
              </p>
            </div>

            <div className="bg-pawLight border border-pawSecondary rounded-2xl p-4 flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pawSecondary flex items-center justify-center text-lg shrink-0">
                  🐾
                </div>
                <div>
                  <p className="text-xs text-pawText/60 font-medium">Publicado por</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-pawText">
                      {esMiPublicacion
                        ? `${user?.nombre || user?.email} (Tú)`
                        : (publicacion.vendedor || 'Comunidad PawtoPaw')}
                    </p>
                    {esMiPublicacion && (
                      <span className="bg-pawAccent text-pawText text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                        Tu publicación
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {esMiPublicacion && (
                <Link
                  to={`/editar-publicacion/${publicacion.id}`}
                  className="bg-white border border-pawSecondary hover:bg-pawSecondary text-pawText font-bold text-xs px-3.5 py-2 rounded-xl transition-colors shadow-2xs"
                >
                  ✏️ Editar
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  if (agregarAlCarrito) {
                    agregarAlCarrito(publicacion);
                    setAgregadoReciente(true);
                  }
                }}
                className="flex-1 bg-pawPrimary text-white font-bold py-4 rounded-full hover:opacity-90 hover:scale-[1.01] transition-all shadow-sm cursor-pointer"
              >
                {publicacion.categoria === 'petsitter' ? 'Contratar servicio' : 'Agregar al carrito'}
              </button>
              <button
                onClick={() => toggleFavorito && toggleFavorito(publicacion)}
                className={`px-6 py-4 font-bold rounded-full transition-all cursor-pointer flex items-center justify-center text-lg ${
                  estaEnFavoritos
                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-sm'
                    : 'bg-pawSecondary text-pawText hover:bg-pawAccent'
                }`}
                title={estaEnFavoritos ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              >
                ♥
              </button>
            </div>

            {agregadoReciente && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center justify-between gap-3 text-sm text-emerald-800 shadow-xs animate-fadeIn">
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-lg">✅</span>
                  <span>¡"{publicacion.titulo}" agregado al carrito de compras!</span>
                </div>
                <Link
                  to="/carrito"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-full text-xs transition-colors shadow-xs shrink-0"
                >
                  Ver Carrito 🛒
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN COMPLETA DE VALORACIÓN Y RESEÑAS */}
      <section id="seccion-resenas" className="bg-white border border-pawSecondary rounded-3xl p-6 md:p-10 shadow-sm scroll-mt-24">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-2xl">⭐</span>
          <div>
            <h2 className="text-2xl font-extrabold text-pawText">Valoraciones y Reseñas</h2>
            <p className="text-sm text-pawText/70">Opiniones reales de dueños de mascotas y clientes</p>
          </div>
        </div>

        {/* Resumen de Calificación y Formulario */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-pawSecondary">
          {/* Columna Izquierda: Tarjeta de Promedio y Barras */}
          <div className="lg:col-span-5 bg-pawLight border border-pawSecondary rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-pawText/60 mb-2">Puntuación General</p>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-5xl font-black text-pawText">
                  {totalResenas > 0 ? promedioEstrellas : '0.0'}
                </span>
                <span className="text-lg font-bold text-pawText/50">de 5</span>
              </div>

              {/* Estrellas doradas grandes */}
              <div className="flex text-amber-400 text-2xl mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i}>
                    {totalResenas > 0 && i <= Math.round(Number(promedioEstrellas)) ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <p className="text-xs text-pawText/70 font-medium mb-6">
                {totalResenas > 0
                  ? `Basado en ${totalResenas} ${totalResenas === 1 ? 'opinión' : 'opiniones'} verificadas`
                  : 'Esta publicación aún no tiene opiniones'}
              </p>

              {/* Barras de distribución */}
              <div className="space-y-2">
                {desgloseEstrellas.map((item) => (
                  <div key={item.estrellas} className="flex items-center gap-3 text-xs">
                    <span className="w-12 font-bold text-pawText flex items-center gap-1">
                      {item.estrellas} <span className="text-amber-400">★</span>
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-amber-400 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${item.porcentaje}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-semibold text-pawText/70">
                      {item.cuenta}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-pawSecondary/60 flex items-center gap-2 text-xs text-pawText/70">
              <span>🐾</span>
              <span>100% valoraciones auténticas de la comunidad PawtoPaw</span>
            </div>
          </div>

          {/* Columna Derecha: Formulario para Calificar */}
          <div className="lg:col-span-7 bg-white border border-pawSecondary rounded-2xl p-6 shadow-2xs">
            <h3 className="text-lg font-bold text-pawText mb-1 flex items-center gap-2">
              <span>✍️</span> Deja tu valoración
            </h3>
            <p className="text-xs text-pawText/70 mb-5">
              Comparte tu experiencia para ayudar a otros amantes de las mascotas.
            </p>

            {mensajeExito && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
                <span>✅</span>
                <span>{mensajeExito}</span>
              </div>
            )}

            {mensajeError && (
              <div className="mb-4 p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
                <span>⚠️</span>
                <span>{mensajeError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitResena} className="space-y-4">
              {/* Selector interactivo de estrellas */}
              <div>
                <label className="block text-xs font-bold text-pawText uppercase tracking-wider mb-2">
                  ¿Cómo calificarías este producto o servicio?
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCalificacionSeleccionada(star)}
                      onMouseEnter={() => setHoverCalificacion(star)}
                      onMouseLeave={() => setHoverCalificacion(0)}
                      className="text-3xl text-amber-400 hover:scale-125 transition-transform cursor-pointer focus:outline-hidden"
                      title={`${star} estrellas`}
                    >
                      {star <= estrellasActivas ? '★' : '☆'}
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-pawText/80 bg-pawLight px-3 py-1.5 rounded-full border border-pawSecondary">
                    {descripcionesEstrellas[estrellasActivas]}
                  </span>
                </div>
              </div>

              {/* Nombre de autor si no está logueado */}
              {!user && (
                <div>
                  <label className="block text-xs font-bold text-pawText mb-1">
                    Tu nombre o apodo (opcional)
                  </label>
                  <input
                    type="text"
                    value={nombreInvitado}
                    onChange={(e) => setNombreInvitado(e.target.value)}
                    placeholder="Ej. Sofía MascotaLover"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-pawSecondary focus:border-pawPrimary focus:ring-1 focus:ring-pawPrimary outline-hidden bg-pawLight"
                  />
                </div>
              )}

              {user && (
                <div className="flex items-center gap-2 text-xs text-pawText/80 bg-pawLight p-2.5 rounded-xl border border-pawSecondary">
                  <span>👤</span>
                  <span>Publicando como: <strong>{user.nombre || user.email}</strong></span>
                </div>
              )}

              {/* Comentario */}
              <div>
                <label className="block text-xs font-bold text-pawText mb-1">
                  Tu reseña o comentario
                </label>
                <textarea
                  rows="3"
                  value={comentarioTexto}
                  onChange={(e) => setComentarioTexto(e.target.value)}
                  placeholder="Cuéntanos qué te pareció la calidad, la atención o cómo reaccionó tu mascota..."
                  className="w-full text-sm px-4 py-3 rounded-xl border border-pawSecondary focus:border-pawPrimary focus:ring-1 focus:ring-pawPrimary outline-hidden resize-none bg-pawLight"
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-pawPrimary hover:opacity-95 text-white font-bold py-3 px-6 rounded-full transition-all text-sm shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {enviando ? 'Enviando valoración...' : 'Publicar valoración ⭐'}
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Reseñas */}
        <div className="pt-8">
          <h3 className="text-lg font-bold text-pawText mb-6 flex items-center gap-2">
            <span>💬</span> Reseñas de la comunidad ({resenas.length})
          </h3>

          {cargandoResenas ? (
            <div className="py-8 text-center text-pawText/60 text-sm">
              Cargando opiniones de clientes...
            </div>
          ) : resenas.length === 0 ? (
            <div className="py-10 text-center bg-pawLight rounded-2xl border border-dashed border-pawSecondary">
              <span className="text-3xl block mb-2">🐾</span>
              <p className="font-bold text-pawText text-base">Aún no hay valoraciones para esta publicación</p>
              <p className="text-xs text-pawText/70 mt-1">¡Sé el primero en calificar y ayudar a la comunidad!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resenas.map((r, idx) => (
                <div
                  key={r.id || idx}
                  className="bg-pawLight/70 border border-pawSecondary rounded-2xl p-5 hover:bg-pawLight transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-pawPrimary text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {(r.autor || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-pawText leading-none">{r.autor}</p>
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
                            ✓ Verificado 🐾
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-pawText/50 font-medium">{r.fecha || 'Reciente'}</span>
                    </div>

                    {/* Estrellas */}
                    <div className="flex text-amber-400 text-sm my-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span key={i}>
                          {i <= Number(r.calificacion) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>

                    <p className="text-pawText/85 text-xs sm:text-sm leading-relaxed mt-1">
                      "{r.comentario}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}