export interface ResponseExistenciaProductosInterface {
  productoId: string;
  productoNombre: string;
  codigo: string;
  codigo_barra: string;
  sucursalId: string;
  sucursalNombre: string;
  paisId: string;
  paisNombre: string;
  existenciaTotal: string;
  imagenes: Array<null | string>;
}
