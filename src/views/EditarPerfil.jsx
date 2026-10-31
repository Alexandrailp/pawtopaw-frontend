import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function EditarPerfil() {
  const { user, setUser, actualizarPerfilUsuario } = useContext(UserContext);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState(user?.nombre || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telefono, setTelefono] = useState(user?.telefono || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) return alert('El nombre y el email son obligatorios');

    try {
      setGuardando(true);
      if (actualizarPerfilUsuario) {
        await actualizarPerfilUsuario({ nombre, email, telefono, avatar });
      } else {
        setUser({ ...user, nombre, email, telefono, avatar });
      }
      alert('¡Perfil y publicaciones actualizados con éxito!');
      navigate('/perfil');
    } catch (err) {
      alert(err.message || 'Error al actualizar el perfil');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div 
      className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-repeat bg-[size:350px]"
      style={{ backgroundImage: "url('/bg-doodles.jpg')" }}
    >
      <div className="w-full max-w-md bg-white border border-pawSecondary rounded-3xl p-8 md:p-10 shadow-lg flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-pawText mb-6 text-center">
          Editar Perfil
        </h2>

        <div className="w-24 h-24 rounded-full bg-pawSecondary border-4 border-pawAccent overflow-hidden mb-6 shadow-xs flex items-center justify-center">
          {avatar ? (
            <img src={avatar} alt="Vista previa" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-extrabold text-pawText uppercase">
              {(nombre || email || 'P')[0]}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-pawLight border border-pawPrimary rounded-full px-6 py-3.5 text-center text-pawText placeholder-pawText/60 outline-none focus:ring-2 focus:ring-pawAccent transition-all"
          />

          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-pawLight border border-pawPrimary rounded-full px-6 py-3.5 text-center text-pawText placeholder-pawText/60 outline-none focus:ring-2 focus:ring-pawAccent transition-all"
          />

          <input
            type="tel"
            placeholder="teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full bg-pawLight border border-pawPrimary rounded-full px-6 py-3.5 text-center text-pawText placeholder-pawText/60 outline-none focus:ring-2 focus:ring-pawAccent transition-all"
          />

          <input
            type="url"
            placeholder="url foto de perfil"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full bg-pawLight border border-pawPrimary rounded-full px-6 py-3.5 text-center text-pawText placeholder-pawText/60 outline-none focus:ring-2 focus:ring-pawAccent transition-all"
          />

          <button
            type="submit"
            className="w-full bg-pawPrimary text-white font-bold py-3.5 rounded-full hover:opacity-90 transition-opacity shadow-sm mt-2 cursor-pointer"
          >
            Guardar cambios
          </button>
        </form>

        <Link
          to="/perfil"
          className="w-full mt-4 bg-pawAccent text-pawText text-sm font-bold py-3.5 rounded-full hover:bg-pawSecondary transition-colors text-center shadow-xs"
        >
          Cancelar
        </Link>
      </div>
    </div>
  );
}