import { Categoria } from "@/api/categorias/interfaces/response-categorias";
import { SubCategoria } from "@/api/subcategorias/interface/get-subcategorias.interface";

export interface ResponseTipoProductoInterface {
  tipos: TipoProducto[];
  total: number;
  limit: number;
  offset: number;
}

export interface TipoProducto {
  id: string;
  nombre: string;
  descripcion: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  sub_categoria?: SubCategoria;
  categoria?: Categoria;
}
