export default function Card({ titulo, precio, imagen, estrellas }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pawSecondary overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="h-56 bg-pawLight flex justify-center items-center p-4">
        <img src={imagen} alt={titulo} className="max-h-full object-contain mix-blend-multiply rounded-xl" />
      </div>
      <div className="p-5 flex flex-col gap-2">
        <h3 className="font-bold text-pawText text-sm leading-tight line-clamp-2 h-10">{titulo}</h3>
        <div className="text-pawPrimary text-xs tracking-widest">
          {'★'.repeat(estrellas)}{'☆'.repeat(5-estrellas)}
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="font-extrabold text-xl text-pawText">${precio}</span>
          <button className="bg-pawAccent text-pawText w-9 h-9 rounded-full flex items-center justify-center hover:bg-pawPrimary transition-colors shadow-sm">
            ➕
          </button>
        </div>
      </div>
    </div>
  );
}