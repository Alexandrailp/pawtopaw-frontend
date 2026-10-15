import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserProvider from './context/UserContext';
import Navbar from './components/Navbar';
import Home from './views/Home';
import Login from './views/Login';
import Registro from './views/Registro';
import Perfil from './views/Perfil';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}