import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    titulo: 'Paseos y cuidado experto de confianza',
    imagen: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1200&q=80',
    colorBurbuja: 'bg-pawPrimary',
    colorTextoBurbuja: 'text-pawLight'
  },
  {
    id: 3,
    tipo: 'Nuevo Accesorio',
    titulo: 'Camas ultra suaves para un descanso perfecto',
    imagen: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200&q=80',
    colorBurbuja: 'bg-pawSecondary',
    colorTextoBurbuja: 'text-pawText'
  }
];

const publicaciones = [
  { id: 1, categoria: 'petsitter', titulo: 'Paseo de Perros 1 hr', precio: 5000, imagen: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=500', estrellas: 5, cantidad: 42, comprados: 120 },
  { id: 2, categoria: 'producto', titulo: 'Casa para Gato', precio: 15000, imagen: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500', estrellas: 4, cantidad: 18, comprados: 45 },
  { id: 3, categoria: 'producto', titulo: 'Alimento Premium 10kg', precio: 35000, imagen: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500', estrellas: 5, cantidad: 64, comprados: 210 },
  { id: 4, categoria: 'petsitter', titulo: 'Cuidado a domicilio (Día)', precio: 20000, imagen: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500', estrellas: 5, cantidad: 31, comprados: 85 },
  { id: 5, categoria: 'producto', titulo: 'Juguete Cuerda Resistente', precio: 8000, imagen: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=500', estrellas: 4, cantidad: 12, comprados: 95 },
  { id: 6, categoria: 'petsitter', titulo: 'Guardería Diurna Felina', precio: 12000, imagen: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500', estrellas: 5, cantidad: 27, comprados: 60 }
];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [orden, setOrden] = useState('');

  const filtroCategoria = searchParams.get('categoria') || 'todos';

  const scrollACatalogo = () => {
    const catalogo = document.getElementById('catalogo');
    if (catalogo) {
      catalogo.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const cat = searchParams.get('categoria');
    if (cat === 'producto' || cat === 'petsitter') {
      const timer = setTimeout(scrollACatalogo, 100);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const toggleCategoria = (cat) => {
    const nueva = (filtroCategoria === cat || cat === 'todos') ? 'todos' : cat;
    if (nueva === 'todos') {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('categoria');
      setSearchParams(newParams, { replace: true });
    } else {
      setSearchParams({ categoria: nueva }, { replace: true });
    }
  };

  const publicacionesFiltradas = publicaciones
    .filter((pub) => (filtroCategoria === 'todos' ? true : pub.categoria === filtroCategoria))
    .sort((a, b) => {
      if (orden === 'mayor-menor') return b.precio - a.precio;
      if (orden === 'menor-mayor') return a.precio - b.precio;
      if (orden === 'mas-comprados') return b.comprados - a.comprados;
      if (orden === 'mas-recomendados') return b.estrellas - a.estrellas || b.cantidad - a.cantidad;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      <div className="relative w-full mt-6 rounded-3xl overflow-hidden shadow-sm h-[400px] md:h-[500px] group">
        <div 
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {heroSlides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full relative">
              <img 
                src={slide.imagen} 
                alt={slide.titulo} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-12 md:px-24">
                <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest w-max mb-4 ${slide.colorBurbuja} ${slide.colorTextoBurbuja}`}>
                  {slide.tipo.toUpperCase()}
                </span>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg max-w-2xl">
                  {slide.titulo}
                </h2>
                <button className="mt-8 bg-pawLight text-pawText font-bold py-3 px-8 rounded-full w-max hover:bg-pawSecondary hover:scale-105 transition-all shadow-md cursor-pointer">
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={prevSlide} 
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-pawText w-11 h-11 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
        >
          ❮
        </button>
        <button 
          onClick={nextSlide} 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-pawText w-11 h-11 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
        >
          ❯
        </button>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                currentIndex === index ? 'w-8 bg-pawAccent' : 'w-2.5 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>

      <div 
        id="catalogo" 
        className="mt-12 flex flex-col md:flex-row gap-8 items-start scroll-mt-6"
      >
        <aside className="w-full md:w-64 shrink-0 bg-white border border-pawSecondary rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <label htmlFor="ordenar-select" className="block font-bold text-pawText text-lg mb-3">
              Ordenar
            </label>
            <select
              id="ordenar-select"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="w-full bg-pawLight border border-pawPrimary/50 rounded-xl px-3 py-2.5 text-sm text-pawText font-medium outline-none focus:border-pawPrimary focus:ring-1 focus:ring-pawPrimary transition-all cursor-pointer"
            >
              <option value="">Seleccionar...</option>
              <option value="mayor-menor">Precio: mayor a menor</option>
              <option value="menor-mayor">Precio: menor a mayor</option>
              <option value="mas-comprados">Más comprados</option>
              <option value="mas-recomendados">Más recomendados</option>
            </select>
          </div>

          <div className="border-t border-pawSecondary pt-6">
            <h4 className="font-bold text-pawText text-lg mb-3">Categorías</h4>
            <div className="flex flex-col gap-2 text-sm">
              <button
                onClick={() => toggleCategoria('todos')}
                className={`text-left px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                  filtroCategoria === 'todos' ? 'bg-pawPrimary font-bold text-white' : 'hover:bg-pawSecondary/60 text-pawText/80'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => toggleCategoria('producto')}
                className={`text-left px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                  filtroCategoria === 'producto' ? 'bg-pawPrimary font-bold text-white' : 'hover:bg-pawSecondary/60 text-pawText/80'
                }`}
              >
                Productos
              </button>
              <button
                onClick={() => toggleCategoria('petsitter')}
                className={`text-left px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                  filtroCategoria === 'petsitter' ? 'bg-pawPrimary font-bold text-white' : 'hover:bg-pawSecondary/60 text-pawText/80'
                }`}
              >
                Petsitter
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {publicacionesFiltradas.map((pub) => (
            <Card 
              key={pub.id}
              id={pub.id}
              titulo={pub.titulo} 
              precio={pub.precio} 
              imagen={pub.imagen} 
              estrellas={pub.estrellas} 
              cantidad={pub.cantidad}
            />
          ))}
        </div>
      </div>
    </div>
  );
}