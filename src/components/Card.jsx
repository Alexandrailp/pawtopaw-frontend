export default function Card({ titulo, precio, imagen }) {
  return (
    <div className="card h-100 shadow-sm border-0" style={{ backgroundColor: '#FFFDF9', borderRadius: '15px' }}>
      <img 
        src={imagen} 
        className="card-img-top" 
        alt={titulo} 
        style={{ height: '200px', objectFit: 'cover', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }} 
      />
      <div className="card-body d-flex flex-column text-center">
        <h5 className="card-title fw-bold" style={{ color: '#5C4033' }}>{titulo}</h5>
        <p className="card-text fs-5" style={{ color: '#A0522D' }}>${precio}</p>
        <button 
          className="btn mt-auto fw-bold" 
          style={{ backgroundColor: '#DEB887', color: '#5C4033', borderRadius: '10px' }}
        >
          Ver más
        </button>
      </div>
    </div>
  );
}