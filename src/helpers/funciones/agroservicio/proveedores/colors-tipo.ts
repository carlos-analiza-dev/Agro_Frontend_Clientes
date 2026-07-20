import {
  TipoEscala,
  TipoPagoProveedor,
} from "@/api/agroservicio/proveedores/interface/response-agro-proveedores.interface";

export const getTipoPagoColor = (tipo: TipoPagoProveedor) => {
  switch (tipo) {
    case TipoPagoProveedor.CONTADO:
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case TipoPagoProveedor.CREDITO:
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export const getTipoEscalaColor = (tipo: TipoEscala) => {
  switch (tipo) {
    case TipoEscala.ESCALA:
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case TipoEscala.DESCUENTO:
      return "bg-orange-100 text-orange-800 hover:bg-orange-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};
