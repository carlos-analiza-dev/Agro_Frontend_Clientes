export interface ResponseExistenciaInterface {
  suficiente: boolean;
  detalles: Detalle[];
}

export interface Detalle {
  productoId: string;
  productoNombre: string;
  cantidadRequerida: number;
  existenciaDisponible: number;
  suficiente: boolean;
}
