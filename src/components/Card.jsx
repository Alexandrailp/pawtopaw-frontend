export default function Card({ titulo, precio, imagen }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', width: '200px', borderRadius: '8px' }}>
      <img src={imagen} alt={titulo} style={{ width: '100%', borderRadius: '4px' }} />
      <h3 style={{ fontSize: '1.2rem' }}>{titulo}</h3>
      <p>Precio: ${precio}</p>
      <button style={{ background: '#007bff', color: 'white', border: 'none', padding: '0.5rem', width: '100%', cursor: 'pointer' }}>
        Ver más
      </button>
    </div>
  );
}