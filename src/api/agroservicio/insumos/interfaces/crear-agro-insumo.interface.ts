import { UnidadVenta } from "./response-agro-insumos.interface";

export interface CrearAgroInsumoInterface {
  nombre: string;
  costo: number;
  marcaId: string;
  proveedorId: string;
  unidad_venta: UnidadVenta;
}
