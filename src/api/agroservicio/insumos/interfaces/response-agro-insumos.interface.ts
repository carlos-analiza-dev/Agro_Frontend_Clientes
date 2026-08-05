import { Marca } from "@/api/marcas/interface/response-marcas.interface";
import { ProveedoreAgro } from "../../proveedores/interface/response-agro-proveedores.interface";
import { ResponseInfoAgro } from "../../mi-agroservicio/interface/response-info-agro.interface";

export enum UnidadVenta {
  UNIDAD = "unidad",
  KILOGRAMO = "kilogramo",
  LIBRA = "libra",
  GALON = "galon",
  METRO = "metro",
  PIE = "pie",
  M2 = "m2",
}

export interface ResponseAgroInsumos {
  insumos: AgroInsumo[];
  total: number;
}

export interface AgroInsumo {
  id: string;
  nombre: string;
  codigo: string;
  costo: string;
  unidad_venta: UnidadVenta;
  disponible: boolean;
  createdAt: string;
  updatedAt: string;
  marca: Marca;
  proveedor: ProveedoreAgro;
  agroservicio: ResponseInfoAgro;
}
