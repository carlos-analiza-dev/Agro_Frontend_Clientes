export interface ResponseConsumoInsumoInterface {
  data: ConsumoInsumo[];
  total: number;
  limit: number;
  offset: number;
}

export interface ConsumoInsumo {
  id: string;
  cantidad: string;
  fecha_consumo: string;
  observacion: string;
  created_at: string;
  updated_at: string;
  sucursal: Sucursal;
  insumo: Insumo;
  lote: Lote;
}

export interface Insumo {
  id: string;
  nombre: string;
  codigo: string;
  costo: string;
  unidad_venta: string;
  disponible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lote {
  id: string;
  cantidad: string;
  costo: string;
  costo_por_unidad: string;
  created_at: string;
  updated_at: string;
}

export interface Sucursal {
  id: string;
  nombre: string;
  tipo: string;
  latitud: string;
  longitud: string;
  direccion_complemento: string;
  paisId: string;
  departamentoId: string;
  municipioId: string;
  gerenteId: null;
  agroservicioId: string;
  creadoPorId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
