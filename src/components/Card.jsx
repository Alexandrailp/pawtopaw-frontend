export default function Card({ titulo, precio, imagen, estrellas, cantidad }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pawSecondary overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer">
      <div className="h-52 bg-pawLight flex justify-center items-center p-4">
        <img src={imagen} alt={titulo} className="max-h-full object-contain mix-blend-multiply rounded-xl" />
      </div>
      <div className="p-5 flex flex-col flex-1 justify-between gap-2">
        <h3 className="font-bold text-pawText text-base leading-snug line-clamp-2">{titulo}</h3>
        <div className="mt-2 flex flex-col gap-1">
          <span className="font-extrabold text-xl text-pawText">
            ${precio.toLocaleString('es-CL')}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-pawPrimary text-sm tracking-widest">
              {'★'.repeat(estrellas)}{'☆'.repeat(5 - estrellas)}
            </span>
            <span className="text-xs text-pawText/70 font-semibold">({cantidad})</span>
          </div>
        </div>
      </div>
    </div>
  );
}