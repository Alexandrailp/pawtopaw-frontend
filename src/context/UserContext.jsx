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
      
      const articulosFormateados = data.map((art) => ({
        id: art.id,
        categoria: art.tipo_id === 2 ? 'petsitter' : 'producto',
        titulo: corregirTexto(art.titulo),
        precio: Number(art.precio),
        imagen: art.imagen,
        usuario_id: art.usuario_id,
        usuario_email: art.usuario_email,
        estrellas: 5,
        cantidad: 15,
        comprados: 20,
        vendedor: art.vendedor || (art.usuario_id === 1 ? 'Camila Rojas' : 'Comunidad PawtoPaw'),
        descripcion:
          corregirTexto(art.descripcion) ||
          descripcionesIniciales[art.id] ||
          'Publicación oficial en PawtoPaw. Calidad y confianza garantizada para tu mascota.'
      }));

      setPublicaciones(articulosFormateados);
      return articulosFormateados;
    } catch (error) {
      console.error('Error al obtener artículos:', error);
    }
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
      : (user?.email ? `pawtopaw_articulos_usuario_${user.email}` : 'pawtopaw_mis_articulos');
    const guardados = JSON.parse(localStorage.getItem(userKey) || '[]');
    const filtrados = guardados.filter((artId) => Number(artId) !== idNum);
    localStorage.setItem(userKey, JSON.stringify(filtrados));

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
        finalizarCompra
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider };