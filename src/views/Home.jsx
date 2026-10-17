import { useRef } from 'react';
import Card from '../components/Card';

const heroSlides = [
  {
    id: 1,
    tipo: 'Producto Destacado',
    titulo: 'Alimento Premium para tu mascota',
    imagen: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=1200&q=80',
    colorBurbuja: 'bg-pawAccent',
    colorTextoBurbuja: 'text-pawText'
  },
  {
    id: 2,
    tipo: 'Petsitter Estrella',
    titulo: 'Paseos y cuidado experto para Chocolate y Moka',
    imagen: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1200&q=80',
    colorBurbuja: 'bg-pawPrimary',
    colorTextoBurbuja: 'text-pawLight'
  },
  {
    id: 3,
    tipo: 'Nuevo Accesorio',
    titulo: 'Camas ultra suaves para que Grecia descanse',
    imagen: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200&q=80',
    colorBurbuja: 'bg-pawSecondary',
    colorTextoBurbuja: 'text-pawText'
  }
];

const publicaciones = [
  { id: 1, titulo: 'Paseo de Perros 1 hr', precio: 5000, imagen: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=500', estrellas: 5 },
  { id: 2, titulo: 'Casa para Gato', precio: 15000, imagen: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500', estrellas: 4 },
  { id: 3, titulo: 'Alimento Premium 10kg', precio: 35000, imagen: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500', estrellas: 5 },
  { id: 4, titulo: 'Cuidado a domicilio (Día)', precio: 20000, imagen: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500', estrellas: 5 }
];

export default function Home() {
  const sliderRef = useRef(null);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      <div className="relative w-full mt-6 rounded-3xl overflow-hidden shadow-sm h-[400px] md:h-[500px] group">
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto snap-x snap-mandatory h-full scroll-smooth" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {heroSlides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full snap-center relative">
              <img 
                src={slide.imagen} 
                alt={slide.titulo} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8 md:px-24">
                <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest w-max mb-4 ${slide.colorBurbuja} ${slide.colorTextoBurbuja}`}>
                  {slide.tipo.toUpperCase()}
                </span>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg max-w-2xl">
                  {slide.titulo}
                </h2>
                <button className="mt-8 bg-pawLight text-pawText font-bold py-3 px-8 rounded-full w-max hover:bg-pawSecondary hover:scale-105 transition-all shadow-md">
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={slideLeft} 
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-pawText w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity text-xl"
        >
          ❮
        </button>
        <button 
          onClick={slideRight} 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-pawText w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity text-xl"
        >
          ❯
        </button>
      </div>

      <div className="mt-16">
        <div className="flex justify-between items-end mb-8 border-b border-pawSecondary pb-4">
          <h3 className="text-2xl font-bold text-pawText">Catálogo General</h3>
          <a href="#" className="text-pawPrimary font-semibold text-sm hover:text-pawAccent transition-colors">Ver todo →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {publicaciones.map((pub) => (
            <Card 
              key={pub.id}
              titulo={pub.titulo} 
              precio={pub.precio} 
              imagen={pub.imagen} 
              estrellas={pub.estrellas} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}