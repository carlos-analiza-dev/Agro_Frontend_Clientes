export interface CrearDescuentoInterface {
  productoId: string;
  proveedorId: string;
  paisId: string;
  cantidad_comprada: number;
  descuentos: number;
  isActive?: boolean;
}
