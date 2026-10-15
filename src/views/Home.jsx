import Card from '../components/Card';

const publicaciones = [
  { id: 1, titulo: 'Paseo de Perros 1 hr', precio: 5000, imagen: 'https://via.placeholder.com/150?text=Paseo' },
  { id: 2, titulo: 'Casa para Gato', precio: 15000, imagen: 'https://via.placeholder.com/150?text=Casa+Gato' },
  { id: 3, titulo: 'Alimento Premium 10kg', precio: 35000, imagen: 'https://via.placeholder.com/150?text=Alimento' }
];

export default function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Bienvenido a PawtoPaw 🐾</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        {publicaciones.map((pub) => (
          <Card 
            key={pub.id} 
            titulo={pub.titulo} 
            precio={pub.precio} 
            imagen={pub.imagen} 
          />
        ))}
      </div>
    </div>
  );
}git 