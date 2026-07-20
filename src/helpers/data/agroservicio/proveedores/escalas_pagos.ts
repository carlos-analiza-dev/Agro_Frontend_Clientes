import {
  TipoEscala,
  TipoPagoProveedor,
} from "@/api/agroservicio/proveedores/interface/response-agro-proveedores.interface";

export const tiposEscala = [
  { id: 1, value: TipoEscala.ESCALA, label: "Escala" },
  { id: 2, value: TipoEscala.DESCUENTO, label: "Descuento" },
] as const;

export const tiposPagoProveedor = [
  { id: 1, value: TipoPagoProveedor.CONTADO, label: "Contado" },
  { id: 2, value: TipoPagoProveedor.CREDITO, label: "Crédito" },
] as const;
