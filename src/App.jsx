import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './views/Home';
import Login from './views/Login';
import Registro from './views/Registro';
import Perfil from './views/Perfil';
import CrearPublicacion from './views/CrearPublicacion';
import EditarPublicacion from './views/EditarPublicacion';
import EditarPerfil from './views/EditarPerfil';
import DetallePublicacion from './views/DetallePublicacion';
import Carrito from './views/Carrito';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/crear-publicacion" element={<CrearPublicacion />} />
        <Route path="/editar-publicacion/:id" element={<EditarPublicacion />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
        <Route path="/publicacion/:id" element={<DetallePublicacion />} />
      </Routes>
    </BrowserRouter>
  );
}