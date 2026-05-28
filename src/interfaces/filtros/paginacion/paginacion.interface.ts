import { EstadoPedido } from "@/api/pedidos/interface/crear-pedido.interface";

export interface PaginationInterface {
  limit?: number;
  offset?: number;

  name?: string;
  categoria?: string;
  subcategoria?: string;
  tipo_producto?: string;
  indicaciones?: string;
  tipo_uso?: string;

  marca?: string;
  proveedor?: string;
  producto?: string;
  tipo_categoria?: string;

  estado?: EstadoPedido;

  insumo?: string;
  sucursal?: string;

  tipoPago?: string;
  tipoMantenimiento?: string;

  metodoPago?: string;
  metodo_pago?: string;

  numeroFactura?: string;
  servicio?: string;

  rol?: string;
  pais?: string;

  fincaId?: string;
  fincaNombre?: string;

  especieId?: string;
  especie?: string;

  identificador?: string;

  fecha?: string;
  fechaInicio?: string;
  fechaFin?: string;

  year?: number;

  animalId?: string;

  intensidad?: string;
  mes?: string;

  trabajadorId?: string;

  equipoId?: string;
  actividadId?: string;
  operadorId?: string;

  activos?: boolean;
  activo?: boolean;
  is_market?: boolean;

  latitud?: number;
  longitud?: number;

  limite?: number;
  radio?: number;

  usarGoogleMaps?: boolean;

  categoriaId?: string;

  subcategoriaId?: string;

  tipoProductoId?: string;
}
