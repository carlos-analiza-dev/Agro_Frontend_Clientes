export const getCategoriaColor = (categoria: string) => {
  const colors: Record<string, string> = {
    ALIMENTACION: "bg-green-100 text-green-800",
    MEDICAMENTOS: "bg-red-100 text-red-800",
    COMPRA_ANIMAL: "bg-blue-100 text-blue-800",
    MANO_OBRA: "bg-yellow-100 text-yellow-800",
    INSUMOS_AGRICOLAS: "bg-emerald-100 text-emerald-800",
    MANTENIMIENTO: "bg-gray-100 text-gray-800",
    TRANSPORTE: "bg-orange-100 text-orange-800",
    SERVICIOS_PUBLICOS: "bg-purple-100 text-purple-800",
    IMPUESTOS: "bg-rose-100 text-rose-800",
    SEGUROS: "bg-indigo-100 text-indigo-800",
    EQUIPOS: "bg-cyan-100 text-cyan-800",
    INFRAESTRUCTURA: "bg-amber-100 text-amber-800",
    VETERINARIA: "bg-pink-100 text-pink-800",
    REPRODUCCION: "bg-teal-100 text-teal-800",
    OTROS: "bg-gray-100 text-gray-800",
  };
  return colors[categoria] || "bg-gray-100 text-gray-800";
};
