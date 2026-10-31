import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'https://pawtopaw-backend.onrender.com';

const descripcionesIniciales = {
  1: 'Paseos seguros, entretenidos y personalizados por parques de la zona. Incluye hidratación, reporte con fotos en tiempo real y mucha dedicación para que tu perro gaste energía de forma saludable.',
  2: 'Casa acolchada y térmica ideal para el descanso felino. Fabricada con telas suaves de fácil lavado y base antideslizante.',
  3: 'Fórmula balanceada libre de granos, rica en proteínas de alta calidad, omega 3 y vitaminas esenciales para mantener el pelaje brillante y una digestión óptima.',
  4: 'Cuido a tu mascota en la comodidad de tu hogar para evitarle el estrés del traslado. Incluye alimentación en sus horarios, limpieza, juegos y paseos incluidos.',
  5: 'Juguete de algodón trenzado de alta resistencia, ideal para perros que disfrutan morder y jugar a tirar. Ayuda a limpiar los dientes de forma natural.',
  6: 'Espacio tranquilo, seguro y enriquecido con rascadores y zonas altas para el cuidado diurno de gatitos. Atención personalizada y ambiente libre de estrés.'
};

const resenasBase = {
  1: [
    { id: 'b1', calificacion: 5, comentario: '¡Increíble servicio! Mi perrito Lucas volvió súper feliz y relajado. Muy recomendado.', autor: 'Sofía Martínez', fecha: '28 Oct, 2026' },
    { id: 'b2', calificacion: 5, comentario: 'Puntual y muy cariñoso con las mascotas. Me envió fotos y videos durante todo el paseo.', autor: 'Rodrigo Vera', fecha: '24 Oct, 2026' }
  ],
  2: [
    { id: 'b3', calificacion: 5, comentario: 'Excelente calidad y acabados. Mi gata se adaptó de inmediato y duerme todas sus siestas ahí.', autor: 'Daniela Soto', fecha: '26 Oct, 2026' },
    { id: 'b4', calificacion: 4, comentario: 'Muy linda y calientita. El tamaño es perfecto para departamentos.', autor: 'Felipe A.', fecha: '20 Oct, 2026' }
  ],
  3: [
    { id: 'b5', calificacion: 5, comentario: 'El pelaje de mi perro cambió un 100%, súper brillante y con excelente digestión.', autor: 'Claudia Morales', fecha: '27 Oct, 2026' }
  ],
  4: [
    { id: 'b6', calificacion: 5, comentario: 'Pude viajar con total tranquilidad sabiendo que estaban al cuidado de mis gatitos. Excelente comunicación.', autor: 'Ignacio R.', fecha: '25 Oct, 2026' }
  ],
  5: [
    { id: 'b7', calificacion: 4, comentario: 'Cuerda muy resistente, perfecta para perros con mucha fuerza.', autor: 'Camila J.', fecha: '22 Oct, 2026' }
  ],
  6: [
    { id: 'b8', calificacion: 5, comentario: 'Espacio higiénico y muy enriquecido para gatos. Gran dedicación y cariño.', autor: 'Patricia B.', fecha: '29 Oct, 2026' }
  ]
};

const vendedoresIniciales = {
  1: 'Martín Soto',
  2: 'Tienda MascotaFeliz',
  3: 'NutriPet Chile',
  4: 'Valentina Muñoz',
  5: 'Tienda MascotaFeliz',
  6: 'Carolina Díaz'
};

const corregirTexto = (texto) => {
  if (!texto || typeof texto !== 'string') return '';
  return texto
    .replace(/Guarder¡a/g, 'Guardería')
    .replace(/D¡a/g, 'Día')
    .replace(/¡/g, 'í')
    .replace(/Ã¡/g, 'á')
    .replace(/Ã©/g, 'é')
    .replace(/Ã­/g, 'í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ãº/g, 'ú')
    .replace(/Ã±/g, 'ñ')
    .replace(/Â/g, '');
};

const extraerIdDeToken = (tokenStr) => {
  try {
    if (!tokenStr || typeof tokenStr !== 'string') return null;
    const base64Url = tokenStr.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload).id || null;
  } catch {
    return null;
  }
};

export default function UserProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('pawtopaw_token') || null;
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pawtopaw_user');
      const savedToken = localStorage.getItem('pawtopaw_token');
      let parsed = saved ? JSON.parse(saved) : null;
      if (parsed && !parsed.id && savedToken) {
        const idFromToken = extraerIdDeToken(savedToken);
        if (idFromToken) parsed.id = idFromToken;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [publicaciones, setPublicaciones] = useState([]);

  // Clave de favoritos para el usuario actual
  const getFavKey = (currentUser = user) => {
    return currentUser?.id 
      ? `pawtopaw_favs_${currentUser.id}` 
      : (currentUser?.email ? `pawtopaw_favs_${currentUser.email}` : 'pawtopaw_favs_guest');
  };

  const [favoritos, setFavoritos] = useState(() => {
    try {
      const key = user?.id 
        ? `pawtopaw_favs_${user.id}` 
        : (user?.email ? `pawtopaw_favs_${user.email}` : 'pawtopaw_favs_guest');
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Carrito persistente y unificado (nunca se borra al cambiar de página o sesión)
  const [carrito, setCarrito] = useState(() => {
    try {
      const saved = localStorage.getItem('pawtopaw_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Limpiar clave global antigua si existiera en el navegador
  useEffect(() => {
    try {
      localStorage.removeItem('pawtopaw_mis_articulos');
    } catch {}
  }, []);

  // Mantener favoritos sincronizados si cambia el usuario
  useEffect(() => {
    try {
      const favKey = getFavKey(user);
      const savedFavs = localStorage.getItem(favKey);
      setFavoritos(savedFavs ? JSON.parse(savedFavs) : []);
    } catch {
      setFavoritos([]);
    }
  }, [user]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    if (!producto || !producto.id) return carrito;
    const idNum = Number(producto.id);
    let nuevoCarrito;

    const existe = carrito.find((item) => Number(item.id) === idNum);
    if (existe) {
      nuevoCarrito = carrito.map((item) =>
        Number(item.id) === idNum
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      );
    } else {
      nuevoCarrito = [
        ...carrito,
        {
          id: idNum,
          titulo: producto.titulo,
          precio: Number(producto.precio) || 0,
          imagen: producto.imagen,
          categoria: producto.categoria || 'producto',
          cantidad: cantidad
        }
      ];
    }

    setCarrito(nuevoCarrito);
    localStorage.setItem('pawtopaw_cart', JSON.stringify(nuevoCarrito));
    return nuevoCarrito;
  };

  const eliminarDelCarrito = (id) => {
    const idNum = Number(id);
    const nuevoCarrito = carrito.filter((item) => Number(item.id) !== idNum);
    setCarrito(nuevoCarrito);
    localStorage.setItem('pawtopaw_cart', JSON.stringify(nuevoCarrito));
  };

  const actualizarCantidadCarrito = (id, delta) => {
    const idNum = Number(id);
    let nuevoCarrito = carrito
      .map((item) => {
        if (Number(item.id) === idNum) {
          const nuevaCantidad = item.cantidad + delta;
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      })
      .filter((item) => item.cantidad > 0);

    setCarrito(nuevoCarrito);
    localStorage.setItem('pawtopaw_cart', JSON.stringify(nuevoCarrito));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.setItem('pawtopaw_cart', JSON.stringify([]));
  };

  const cantidadTotalCarrito = carrito.reduce(
    (acc, item) => acc + (Number(item.cantidad) || 1),
    0
  );

  const totalCarrito = carrito.reduce(
    (acc, item) => acc + (Number(item.precio) || 0) * (Number(item.cantidad) || 1),
    0
  );

  const finalizarCompra = async () => {
    if (carrito.length === 0) return false;

    // Crear pedidos para el usuario actual
    const pedidosKey = user?.id
      ? `pawtopaw_pedidos_${user.id}`
      : (user?.email ? `pawtopaw_pedidos_${user.email}` : 'pawtopaw_pedidos_guest');

    let pedidosPrevios = [];
    try {
      pedidosPrevios = JSON.parse(localStorage.getItem(pedidosKey) || '[]');
    } catch {
      pedidosPrevios = [];
    }

    const fechaHoy = new Date().toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const nuevosPedidos = carrito.map((item, index) => ({
      id: Date.now() + index,
      articulo_id: item.id,
      titulo: item.titulo,
      precio: item.precio * item.cantidad,
      cantidad: item.cantidad,
      imagen: item.imagen,
      fecha: fechaHoy,
      estado: 'En preparación'
    }));

    const todosLosPedidos = [...nuevosPedidos, ...pedidosPrevios];
    localStorage.setItem(pedidosKey, JSON.stringify(todosLosPedidos));

    // Si hay token y usuario, intentar registrar en backend
    if (token && user?.id) {
      for (const item of carrito) {
        try {
          await fetch(`${API_URL}/compras`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              usuario_id: user.id,
              articulo_id: item.id
            })
          });
        } catch (e) {
          console.warn('Backend compras warning:', e);
        }
      }
    }

    vaciarCarrito();
    return true;
  };

  const esFavorito = (id) => {
    return favoritos.some((item) => Number(item.id) === Number(id));
  };

  const toggleFavorito = (publicacion) => {
    const key = getFavKey(user);
    const existe = favoritos.some((item) => Number(item.id) === Number(publicacion.id));
    let nuevos;
    if (existe) {
      nuevos = favoritos.filter((item) => Number(item.id) !== Number(publicacion.id));
      alert('Publicación eliminada de tus favoritos.');
    } else {
      nuevos = [publicacion, ...favoritos];
      alert('¡Publicación guardada en tus favoritos!');
    }
    setFavoritos(nuevos);
    localStorage.setItem(key, JSON.stringify(nuevos));
  };

  const updateUser = (nuevoUsuario) => {
    if (nuevoUsuario) {
      setUser(nuevoUsuario);
      localStorage.setItem('pawtopaw_user', JSON.stringify(nuevoUsuario));
    } else {
      setUser(null);
      setToken(null);
      localStorage.removeItem('pawtopaw_user');
      localStorage.removeItem('pawtopaw_token');
    }
  };

  const obtenerArticulos = async () => {
    try {
      const response = await fetch(`${API_URL}/articulos`);
      if (!response.ok) throw new Error('Error al cargar artículos');
      const data = await response.json();
      
      const articulosFormateados = data.map((art) => {
        let resenasLocales = [];
        try {
          resenasLocales = JSON.parse(localStorage.getItem(`pawtopaw_resenas_${art.id}`) || '[]');
        } catch {
          resenasLocales = [];
        }

        const baseArt = resenasBase[art.id] || [];
        const todasResenas = [...resenasLocales, ...baseArt];

        let estrellas = Number(art.estrellas) || 0;
        let cantidad = Number(art.cantidad_resenas) || 0;

        if (todasResenas.length > 0) {
          const suma = todasResenas.reduce((acc, r) => acc + (Number(r.calificacion) || 5), 0);
          estrellas = Math.round(suma / todasResenas.length);
          cantidad = Math.max(cantidad, todasResenas.length);
        }

        const esPropia = Boolean(
          user && (
            (user.id && art.usuario_id && Number(user.id) === Number(art.usuario_id)) ||
            (user.email && art.usuario_email && user.email.toLowerCase() === art.usuario_email.toLowerCase())
          )
        );

        return {
          id: art.id,
          categoria: art.tipo_id === 2 ? 'petsitter' : 'producto',
          titulo: corregirTexto(art.titulo),
          precio: Number(art.precio),
          imagen: art.imagen,
          usuario_id: art.usuario_id,
          usuario_email: art.usuario_email,
          estrellas: cantidad > 0 ? Math.min(5, Math.max(1, estrellas)) : 0,
          cantidad: cantidad,
          comprados: 20,
          vendedor:
            Number(art.id) >= 1 && Number(art.id) <= 6
              ? (vendedoresIniciales[art.id] || 'Comunidad PawtoPaw')
              : (esPropia ? (user.nombre || art.vendedor || 'Comunidad PawtoPaw') : (art.vendedor || 'Comunidad PawtoPaw')),
          descripcion:
            corregirTexto(art.descripcion) ||
            descripcionesIniciales[art.id] ||
            'Publicación oficial en PawtoPaw. Calidad y confianza garantizada para tu mascota.'
        };
      });

      setPublicaciones(articulosFormateados);
      return articulosFormateados;
    } catch (error) {
      console.error('Error al obtener artículos:', error);
    }
  };

  const obtenerResenasArticulo = async (articulo_id) => {
    const idNum = Number(articulo_id);
    let resenasLocales = [];
    try {
      resenasLocales = JSON.parse(localStorage.getItem(`pawtopaw_resenas_${idNum}`) || '[]');
    } catch {
      resenasLocales = [];
    }

    const baseArt = resenasBase[idNum] || [];

    let resenasBackend = [];
    try {
      const res = await fetch(`${API_URL}/articulos/${idNum}/resenas`);
      if (res.ok) {
        const data = await res.json();
        resenasBackend = data.map((r) => ({
          id: `backend_${r.id}`,
          raw_id: r.id,
          usuario_id: r.usuario_id,
          articulo_id: r.articulo_id,
          calificacion: Number(r.calificacion),
          comentario: r.comentario,
          autor: r.autor || (r.autor_email ? r.autor_email.split('@')[0] : 'Cliente PawtoPaw'),
          autor_email: r.autor_email,
          fecha: 'Reciente'
        }));
      }
    } catch (e) {
      console.warn('No se pudieron obtener reseñas del backend:', e);
    }

    const mapa = new Map();
    [...resenasLocales, ...resenasBackend, ...baseArt].forEach((r) => {
      const clave = `${r.calificacion}_${r.comentario}_${r.autor}`;
      if (!mapa.has(clave)) {
        mapa.set(clave, r);
      } else {
        // Enriquecer con IDs o usuario_id si el nuevo objeto los tiene
        const existente = mapa.get(clave);
        mapa.set(clave, { ...existente, ...r });
      }
    });

    return Array.from(mapa.values());
  };

  const calificarArticulo = async ({ articulo_id, calificacion, comentario, nombreAutor }) => {
    const idNum = Number(articulo_id);
    const califNum = Math.min(5, Math.max(1, Number(calificacion)));
    const textoComentario = (comentario || '').trim();

    if (!textoComentario) {
      throw new Error('Por favor escribe un comentario para tu valoración.');
    }

    const autorNombre =
      user?.nombre ||
      nombreAutor ||
      (user?.email ? user.email.split('@')[0] : 'Cliente PawtoPaw');

    let nuevaResena = {
      id: Date.now(),
      usuario_id: user?.id || null,
      articulo_id: idNum,
      calificacion: califNum,
      comentario: textoComentario,
      autor: autorNombre,
      autor_email: user?.email || '',
      fecha: new Date().toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/resenas`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          comentario: textoComentario,
          calificacion: califNum,
          usuario_id: user?.id || 1,
          articulo_id: idNum
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.resena?.id) {
          nuevaResena.id = `backend_${data.resena.id}`;
          nuevaResena.raw_id = data.resena.id;
          nuevaResena.usuario_id = data.resena.usuario_id;
        }
      }
    } catch (e) {
      console.warn('Backend resenas warning:', e);
    }

    let guardadas = [];
    try {
      guardadas = JSON.parse(localStorage.getItem(`pawtopaw_resenas_${idNum}`) || '[]');
    } catch {
      guardadas = [];
    }
    const actualizadas = [nuevaResena, ...guardadas];
    localStorage.setItem(`pawtopaw_resenas_${idNum}`, JSON.stringify(actualizadas));

    setPublicaciones((prev) =>
      prev.map((p) => {
        if (Number(p.id) === idNum) {
          const totalActual = Number(p.cantidad) || 0;
          const estrellasActuales = Number(p.estrellas) || 5;
          const nuevoTotal = totalActual + 1;
          const nuevoPromedio = Math.round(
            (estrellasActuales * totalActual + califNum) / nuevoTotal
          );
          return {
            ...p,
            estrellas: Math.min(5, Math.max(1, nuevoPromedio)),
            cantidad: nuevoTotal
          };
        }
        return p;
      })
    );

    return nuevaResena;
  };

  const editarCalificacionArticulo = async ({ resenaId, articulo_id, calificacion, comentario }) => {
    const idNum = Number(articulo_id);
    const califNum = Math.min(5, Math.max(1, Number(calificacion)));
    const textoComentario = (comentario || '').trim();

    if (!textoComentario) {
      throw new Error('Por favor escribe un comentario para tu valoración.');
    }

    // 1. Actualizar en localStorage
    let guardadas = [];
    try {
      guardadas = JSON.parse(localStorage.getItem(`pawtopaw_resenas_${idNum}`) || '[]');
    } catch {
      guardadas = [];
    }

    const fechaEditada = `${new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })} (editada)`;

    const rawBackendId = String(resenaId).replace('backend_', '');
    const actualizadas = guardadas.map((r) => {
      const coincide =
        String(r.id) === String(resenaId) ||
        String(r.id) === `backend_${resenaId}` ||
        (r.raw_id && String(r.raw_id) === String(rawBackendId));
      if (coincide) {
        return {
          ...r,
          calificacion: califNum,
          comentario: textoComentario,
          fecha: fechaEditada
        };
      }
      return r;
    });
    localStorage.setItem(`pawtopaw_resenas_${idNum}`, JSON.stringify(actualizadas));

    // 2. Si es una reseña del backend, enviar petición al servidor
    if (!isNaN(Number(rawBackendId)) && token) {
      try {
        await fetch(`${API_URL}/resenas/${rawBackendId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            comentario: textoComentario,
            calificacion: califNum,
            usuario_id: user?.id
          })
        });
      } catch (e) {
        console.warn('Backend editar resena warning:', e);
      }
    }

    // 3. Recalcular promedio de estrellas
    setPublicaciones((prev) =>
      prev.map((p) => {
        if (Number(p.id) === idNum) {
          const todas = actualizadas.filter((r) => Number(r.articulo_id || idNum) === idNum);
          if (todas.length > 0) {
            const suma = todas.reduce((acc, r) => acc + (Number(r.calificacion) || 5), 0);
            return {
              ...p,
              estrellas: Math.round(suma / todas.length)
            };
          }
        }
        return p;
      })
    );

    return { id: resenaId, calificacion: califNum, comentario: textoComentario, fecha: fechaEditada };
  };

  const eliminarCalificacionArticulo = async ({ resenaId, articulo_id }) => {
    const idNum = Number(articulo_id);

    // 1. Eliminar de localStorage
    let guardadas = [];
    try {
      guardadas = JSON.parse(localStorage.getItem(`pawtopaw_resenas_${idNum}`) || '[]');
    } catch {
      guardadas = [];
    }

    const rawBackendId = String(resenaId).replace('backend_', '');
    const filtradas = guardadas.filter((r) => {
      const coincide =
        String(r.id) === String(resenaId) ||
        String(r.id) === `backend_${resenaId}` ||
        (r.raw_id && String(r.raw_id) === String(rawBackendId));
      return !coincide;
    });
    localStorage.setItem(`pawtopaw_resenas_${idNum}`, JSON.stringify(filtradas));

    // 2. Eliminar en el backend si corresponde
    if (!isNaN(Number(rawBackendId)) && token) {
      try {
        await fetch(`${API_URL}/resenas/${rawBackendId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
      } catch (e) {
        console.warn('Backend eliminar resena warning:', e);
      }
    }

    // 3. Recalcular promedio y cantidad
    setPublicaciones((prev) =>
      prev.map((p) => {
        if (Number(p.id) === idNum) {
          const nuevaCantidad = Math.max(0, (Number(p.cantidad) || 0) - 1);
          let nuevoPromedio = p.estrellas;
          if (filtradas.length > 0) {
            const suma = filtradas.reduce((acc, r) => acc + (Number(r.calificacion) || 5), 0);
            nuevoPromedio = Math.round(suma / filtradas.length);
          } else if (nuevaCantidad === 0) {
            nuevoPromedio = 0;
          }
          return {
            ...p,
            estrellas: nuevoPromedio,
            cantidad: nuevaCantidad
          };
        }
        return p;
      })
    );

    return true;
  };

  const agregarPublicacionMemoria = (nueva) => {
    setPublicaciones((prev) => [nueva, ...prev]);
  };

  const eliminarPublicacion = async (id) => {
    const idNum = Number(id);

    // 1. Eliminar de publicaciones en memoria
    setPublicaciones((prev) => prev.filter((p) => Number(p.id) !== idNum));

    // 2. Eliminar de la clave de usuario en localStorage
    const userKey = user?.id 
      ? `pawtopaw_articulos_usuario_${user.id}` 
      : (user?.email ? `pawtopaw_articulos_usuario_${user.email}` : null);
    if (userKey) {
      const guardados = JSON.parse(localStorage.getItem(userKey) || '[]');
      const filtrados = guardados.filter((artId) => Number(artId) !== idNum);
      localStorage.setItem(userKey, JSON.stringify(filtrados));
    }
    try { localStorage.removeItem('pawtopaw_mis_articulos'); } catch {}

    // 3. Eliminar de favoritos si estaba
    const favKey = getFavKey(user);
    const favsActuales = JSON.parse(localStorage.getItem(favKey) || '[]');
    const favsFiltrados = favsActuales.filter((f) => Number(f.id) !== idNum);
    setFavoritos(favsFiltrados);
    localStorage.setItem(favKey, JSON.stringify(favsFiltrados));

    // 4. Petición al backend
    try {
      await fetch(`${API_URL}/articulos/${idNum}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
    } catch (e) {
      console.warn('Backend DELETE warning:', e);
    }
  };

  const actualizarPublicacion = async (id, datosActualizados) => {
    const idNum = Number(id);
    const tipo_id = datosActualizados.categoria === 'petsitter' ? 2 : 1;

    setPublicaciones((prev) =>
      prev.map((p) =>
        Number(p.id) === idNum
          ? {
              ...p,
              ...datosActualizados,
              titulo: corregirTexto(datosActualizados.titulo),
              descripcion: corregirTexto(datosActualizados.descripcion),
              tipo_id
            }
          : p
      )
    );

    try {
      await fetch(`${API_URL}/articulos/${idNum}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          titulo: datosActualizados.titulo,
          precio: Number(datosActualizados.precio),
          imagen: datosActualizados.imagen,
          tipo_id,
          descripcion: datosActualizados.descripcion
        })
      });
    } catch (e) {
      console.warn('Backend PUT warning:', e);
    }

    if (obtenerArticulos) {
      obtenerArticulos().catch(() => {});
    }
  };

  useEffect(() => {
    obtenerArticulos();
  }, []);

  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Credenciales incorrectas');
    }

    const userData = {
      id: data.usuario?.id,
      nombre: data.usuario?.nombre || email.split('@')[0],
      email: data.usuario?.email || email
    };

    setToken(data.token);
    setUser(userData);
    localStorage.setItem('pawtopaw_token', data.token);
    localStorage.setItem('pawtopaw_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (nombre, email, password) => {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar usuario');
    }

    await login(email, password);
    return data;
  };

  const actualizarPerfilUsuario = async ({ nombre, email, telefono, avatar }) => {
    const nombreLimpio = (nombre || '').trim();
    const emailLimpio = (email || '').trim();

    if (!nombreLimpio || !emailLimpio) {
      throw new Error('El nombre y el correo electrónico son obligatorios.');
    }

    const usuarioActualizado = {
      ...user,
      nombre: nombreLimpio,
      email: emailLimpio,
      telefono: telefono || '',
      avatar: avatar || ''
    };

    // 1. Guardar de inmediato localmente
    setUser(usuarioActualizado);
    localStorage.setItem('pawtopaw_user', JSON.stringify(usuarioActualizado));

    // 2. Si cambió el correo, migrar claves del usuario en localStorage
    if (user?.email && user.email.toLowerCase() !== emailLimpio.toLowerCase()) {
      try {
        const oldKey = `pawtopaw_articulos_usuario_${user.email}`;
        const newKey = `pawtopaw_articulos_usuario_${emailLimpio}`;
        const items = localStorage.getItem(oldKey);
        if (items) {
          localStorage.setItem(newKey, items);
          localStorage.removeItem(oldKey);
        }
      } catch {}
    }

    // 3. Actualizar el vendedor de todas sus publicaciones en memoria
    setPublicaciones((prev) =>
      prev.map((p) => {
        const esSuya =
          (user?.id && p.usuario_id && Number(p.usuario_id) === Number(user.id)) ||
          (user?.email && p.usuario_email && p.usuario_email.toLowerCase() === user.email.toLowerCase());

        if (esSuya) {
          return {
            ...p,
            vendedor: nombreLimpio,
            usuario_email: emailLimpio
          };
        }
        return p;
      })
    );

    // 4. Intentar actualizar en el backend
    if (user?.id && token) {
      try {
        await fetch(`${API_URL}/usuarios/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            nombre: nombreLimpio,
            email: emailLimpio
          })
        });
      } catch (e) {
        console.warn('Backend actualizar usuario warning:', e);
      }
    }

    return usuarioActualizado;
  };

  const logout = () => {
    updateUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser: updateUser,
        token,
        setToken,
        login,
        register,
        logout,
        publicaciones,
        setPublicaciones,
        obtenerArticulos,
        favoritos,
        toggleFavorito,
        esFavorito,
        eliminarPublicacion,
        actualizarPublicacion,
        agregarPublicacionMemoria,
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidadCarrito,
        vaciarCarrito,
        cantidadTotalCarrito,
        totalCarrito,
        finalizarCompra,
        obtenerResenasArticulo,
        calificarArticulo,
        editarCalificacionArticulo,
        eliminarCalificacionArticulo,
        actualizarPerfilUsuario
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider };