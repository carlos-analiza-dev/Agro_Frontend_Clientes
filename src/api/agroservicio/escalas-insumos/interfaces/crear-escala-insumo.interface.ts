export interface CrearEscalaAgroInsumoInterface {
  insumoId: string;
  proveedorId: string;
  cantidad_comprada: number;
  bonificacion: number;
  costo: number;
  isActive?: boolean;
}
