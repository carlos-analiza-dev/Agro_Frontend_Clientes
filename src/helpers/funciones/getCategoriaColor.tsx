import { CategoriaGasto } from "@/interfaces/enums/gastos.enums";
import { CategoriaIngreso } from "@/interfaces/enums/ingresos.enums";

export const getCategoriaColor = (categoria: CategoriaGasto) => {
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

export const getCategoriaIngresoColor = (categoria: CategoriaIngreso) => {
  const colors: Record<string, string> = {
    VENTA_ANIMAL: "bg-blue-100 text-blue-800",
    VENTA_LECHE: "bg-cyan-100 text-cyan-800",
    VENTA_CARNE: "bg-red-100 text-red-800",
    VENTA_CUERO: "bg-amber-100 text-amber-800",
    VENTA_LANA: "bg-indigo-100 text-indigo-800",
    VENTA_HUEVOS: "bg-yellow-100 text-yellow-800",
    VENTA_ESTIERCOL: "bg-emerald-100 text-emerald-800",
    SUBSIDIOS: "bg-green-100 text-green-800",
    SEGUROS: "bg-purple-100 text-purple-800",
    ARRENDAMIENTOS: "bg-orange-100 text-orange-800",
    SERVICIOS: "bg-teal-100 text-teal-800",
    REPRODUCCION: "bg-pink-100 text-pink-800",
    OTROS: "bg-gray-100 text-gray-800",
  };

  return colors[categoria] || "bg-gray-100 text-gray-800";
};
