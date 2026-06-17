import { TipoPublicacion } from "@/interfaces/enums/market/tipo_publicacion.enum";

export interface CreateMarketplaceAnimale {
  animalId: string;
  nombre: string;
  descripcion: string;

  latitud?: number;
  longitud?: number;

  direccion_completa: string;

  precio: number;
  precio_oferta?: number;

  modelo?: string;
  tipo_publicacion: TipoPublicacion;
  stock: number;

  categoriaId: string;
  subcategoriaId: string;
  marcaId?: string;
  tipoProductoId?: string;

  departamentoId: string;

  disponible?: boolean;
  vendido?: boolean;

  // ALQUILERES
  precioPorHora?: number;
  precioPorDia?: number;
  precioPorSemana?: number;
  precioPorMes?: number;

  requiereDeposito?: boolean;
  montoDeposito?: number;
}
