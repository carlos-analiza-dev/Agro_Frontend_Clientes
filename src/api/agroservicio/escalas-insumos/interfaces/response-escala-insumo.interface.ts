import { ResponseInfoAgro } from "../../mi-agroservicio/interface/response-info-agro.interface";
import { ProveedoreAgro } from "../../proveedores/interface/response-agro-proveedores.interface";

export interface ResponseEscalaInsumos {
  data: Escala[];
  total: number;
}

export interface Escala {
  id: string;
  cantidad_comprada: number;
  bonificacion: number;
  costo: number;
  isActive: boolean;
  insumo: AgroInsumo;
  proveedor: ProveedoreAgro;
  agroservicio: ResponseInfoAgro;
}

export interface AgroInsumo {
  id: string;
  nombre: string;
  codigo: string;
  costo: string;
  unidad_venta: string;
  disponible: boolean;
  createdAt: Date;
  updatedAt: Date;
}
