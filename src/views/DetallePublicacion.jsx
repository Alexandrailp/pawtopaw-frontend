import { useContext, useEffect } from 'react';
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

export default function DetallePublicacion() {
  const { id } = useParams();
  const {
    publicaciones: publicacionesBackend,
    toggleFavorito,
    esFavorito,
    agregarAlCarrito
  } = useContext(UserContext);

  const listaCompleta = (publicacionesBackend && publicacionesBackend.length > 0)
    ? publicacionesBackend
    : publicaciones;

  const publicacion =
    listaCompleta.find((p) => p.id === Number(id)) ||
    publicaciones.find((p) => p.id === Number(id)) ||
    listaCompleta[0] ||
    publicaciones[0];

  const estaEnFavoritos = esFavorito ? esFavorito(publicacion.id) : false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-pawText font-bold text-sm mb-6 hover:text-pawPrimary transition-colors"
      >
        ❮ Volver al catálogo
      </Link>

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

            <div className="flex items-center gap-2 mt-3">
              <span className="text-pawPrimary text-lg tracking-widest">
                {'★'.repeat(publicacion.estrellas || 5)}{'☆'.repeat(5 - (publicacion.estrellas || 5))}
              </span>
              <span className="text-sm text-pawText/70 font-semibold">
                ({publicacion.cantidad || 1} valoraciones)
              </span>
            </div>

            <p className="text-3xl font-extrabold text-pawText mt-6">
              ${(publicacion.precio || 0).toLocaleString('es-CL')}
            </p>

            <div className="border-t border-pawSecondary my-6 pt-6">
              <h3 className="font-bold text-pawText text-base mb-2">Descripción</h3>
              <p className="text-pawText/80 text-sm leading-relaxed">
                {publicacion.descripcion || 'Publicación oficial en PawtoPaw.'}
              </p>
            </div>

            <div className="bg-pawLight border border-pawSecondary rounded-2xl p-4 flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-pawSecondary flex items-center justify-center text-lg">
                🐾
              </div>
              <div>
                <p className="text-xs text-pawText/60 font-medium">Publicado por</p>
                <p className="text-sm font-bold text-pawText">{publicacion.vendedor || 'Comunidad PawtoPaw'}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button
              onClick={() => {
                if (agregarAlCarrito) {
                  agregarAlCarrito(publicacion);
                  alert(`¡"${publicacion.titulo}" agregado al carrito de compras! 🛒`);
                }
              }}
              className="flex-1 bg-pawPrimary text-white font-bold py-4 rounded-full hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
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
        </div>
      </div>
    </div>
  );
}