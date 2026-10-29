import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'https://pawtopaw-backend.onrender.com';

const detallesExtraIniciales = {
  1: {
    descripcion: 'Paseos seguros, entretenidos y personalizados por parques de la zona. Incluye hidratación y reporte con fotos en tiempo real.',
    estrellas: 5,
    cantidad: 42,
    comprados: 120,
    vendedor: 'Martín Soto'
  },
  2: {
    descripcion: 'Casa acolchada y térmica ideal para el descanso felino. Fabricada con telas suaves de fácil lavado y base antideslizante.',
    estrellas: 4,
    cantidad: 18,
    comprados: 45,
    vendedor: 'Tienda MascotaFeliz'
  },
  3: {
    descripcion: 'Fórmula balanceada libre de granos, rica en proteínas de alta calidad, omega 3 y vitaminas esenciales.',
    estrellas: 5,
    cantidad: 64,
    comprados: 210,
    vendedor: 'NutriPet Chile'
  },
  4: {
    descripcion: 'Cuido a tu mascota en la comodidad de tu hogar para evitarle el estrés del traslado.',
    estrellas: 5,
    cantidad: 31,
    comprados: 85,
    vendedor: 'Valentina Muñoz'
  },
  5: {
    descripcion: 'Juguete de algodón trenzado de alta resistencia, ideal para perros que disfrutan morder y jugar a tirar.',
    estrellas: 4,
    cantidad: 12,
    comprados: 95,
    vendedor: 'Tienda MascotaFeliz'
  },
  6: {
    descripcion: 'Espacio tranquilo, seguro y enriquecido con rascadores y zonas altas para el cuidado diurno de gatitos.',
    estrellas: 5,
    cantidad: 27,
    comprados: 60,
    vendedor: 'Carolina Díaz'
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('pawtopaw_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('pawtopaw_token') || null;
  });

  const [publicaciones, setPublicaciones] = useState([]);
  const [pedidos, setPedidos] = useState(() => {
    const savedPedidos = localStorage.getItem('pawtopaw_pedidos');
    return savedPedidos
      ? JSON.parse(savedPedidos)
      : [
          {
            id: 101,
            titulo: 'Alimento Premium 10kg',
            precio: 35000,
            fecha: '14 Oct 2026',
            estado: 'Entregado',
            imagen: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800'
          }
        ];
  });

  const obtenerArticulos = async () => {
    try {
      const response = await fetch(`${API_URL}/articulos`);
      if (!response.ok) throw new Error('Error al cargar artículos');
      const data = await response.json();

      const extrasGuardados = JSON.parse(localStorage.getItem('pawtopaw_extras') || '{}');

      const articulosFormateados = data.map((art) => {
        const extra = extrasGuardados[art.id] || detallesExtraIniciales[art.id] || {};
        return {
          id: art.id,
          categoria: art.tipo_id === 2 ? 'petsitter' : 'producto',
          titulo: art.titulo,
          precio: Number(art.precio),
          imagen: art.imagen,
          descripcion:
            extra.descripcion ||
            'Publicación verificada en la comunidad PawtoPaw. Calidad y confianza garantizada para tu mascota.',
          estrellas: extra.estrellas || 5,
          cantidad: extra.cantidad ?? 10,
          comprados: extra.comprados ?? 0,
          vendedor: extra.vendedor || 'Comunidad PawtoPaw'
        };
      });

      setPublicaciones(articulosFormateados);
    } catch (error) {
      console.error('Error al obtener catálogo desde el backend:', error);
    }
  };

  useEffect(() => {
    obtenerArticulos();
  }, []);

  const register = async (nombre, email, password, telefono, avatar) => {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar usuario');
    }

    await login(email, password, telefono, avatar);
    return data;
  };

  const login = async (email, password, telefonoOpcional, avatarOpcional) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Credenciales incorrectas');
    }

    const usuarioCompleto = {
      id: data.usuario.id,
      nombre: data.usuario.nombre,
      email: data.usuario.email,
      telefono: telefonoOpcional || '+56 9 8765 4321',
      avatar:
        avatarOpcional ||
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300'
    };

    setToken(data.token);
    setUser(usuarioCompleto);
    localStorage.setItem('pawtopaw_token', data.token);
    localStorage.setItem('pawtopaw_user', JSON.stringify(usuarioCompleto));
    return usuarioCompleto;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('pawtopaw_token');
    localStorage.removeItem('pawtopaw_user');
  };

  const updateProfile = (datosActualizados) => {
    const usuarioActualizado = { ...user, ...datosActualizados };
    setUser(usuarioActualizado);
    localStorage.setItem('pawtopaw_user', JSON.stringify(usuarioActualizado));
  };

  const agregarPublicacion = async (nuevaPub) => {
    const tipo_id = nuevaPub.categoria === 'petsitter' ? 2 : 1;
    const payload = {
      titulo: nuevaPub.titulo,
      precio: Number(nuevaPub.precio),
      imagen: nuevaPub.imagen,
      usuario_id: user?.id || 1,
      tipo_id
    };

    const response = await fetch(`${API_URL}/articulos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al publicar el artículo');
    }

    const extrasGuardados = JSON.parse(localStorage.getItem('pawtopaw_extras') || '{}');
    extrasGuardados[data.articulo_id] = {
      descripcion: nuevaPub.descripcion,
      cantidad: Number(nuevaPub.cantidad) || 1,
      estrellas: 5,
      comprados: 0,
      vendedor: user?.nombre || 'Usuario PawtoPaw'
    };
    localStorage.setItem('pawtopaw_extras', JSON.stringify(extrasGuardados));

    await obtenerArticulos();
    return data.articulo_id;
  };

  const comprarPublicacion = async (publicacion) => {
    let estadoCompra = 'En camino';

    if (token && user?.id) {
      const response = await fetch(`${API_URL}/compras`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          usuario_id: user.id,
          articulo_id: publicacion.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        estadoCompra = data.estado || 'En camino';
      }
    }

    const nuevoPedido = {
      id: Date.now(),
      titulo: publicacion.titulo,
      precio: publicacion.precio,
      imagen: publicacion.imagen,
      estado: estadoCompra,
      fecha: new Date().toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };

    const pedidosActualizados = [nuevoPedido, ...pedidos];
    setPedidos(pedidosActualizados);
    localStorage.setItem('pawtopaw_pedidos', JSON.stringify(pedidosActualizados));

    setPublicaciones((prev) =>
      prev.map((item) =>
        item.id === publicacion.id
          ? {
              ...item,
              cantidad: Math.max(0, item.cantidad - 1),
              comprados: (item.comprados || 0) + 1
            }
          : item
      )
    );
  };

  const agregarResena = async (articulo_id, comentario, calificacion = 5) => {
    const response = await fetch(`${API_URL}/resenas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        comentario,
        calificacion: Number(calificacion),
        usuario_id: user?.id || 1,
        articulo_id
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al enviar reseña');
    }
    return data;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        updateProfile,
        publicaciones,
        pedidos,
        agregarPublicacion,
        comprarPublicacion,
        agregarResena
      }}
    >
      {children}
    </UserContext.Provider>
  );
};