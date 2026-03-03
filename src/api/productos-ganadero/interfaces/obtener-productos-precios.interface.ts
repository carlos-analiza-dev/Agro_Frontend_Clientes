import { CategoriaProducto } from "./categories-producto.interface";

export interface ResponseProductosVenta {
  id: string;
  nombre: string;
  categoria: CategoriaProducto;
  ventas: Venta[] | [];
}

export interface Venta {
  id: string;
  unidadMedida: string;
  precio: string;
  moneda: string;
}
