export interface ResponseLotesByProductoInterface {
  id: string;
  id_compra: string;
  id_sucursal: string;
  id_producto: string;
  cantidad: string;
  costo: string;
  costo_por_unidad: string;
  compra: Compra;
  sucursal: Sucursal;
  producto: AgroProducto;
}

export interface Compra {
  id: string;
  proveedorId: string;
  sucursalId: string;
  numero_factura: string;
  tipo_pago: string;
  tipo_compra: string;
  subtotal: string;
  impuestos: string;
  descuentos: string;
  total: string;
  fecha: Date;
  created_at: Date;
  updated_at: Date;
  paisId: string;
  createdById: string;
  updatedById: string;
}

export interface AgroProducto {
  id: string;
  nombre: string;
  codigo: string;
  codigo_barra: string;
  atributos: string;
  tipo: string;
  unidad_venta: string;
  tipo_fraccionamiento: null;
  contenido: number;
  descripcion: string;
  servicioId: null;
  isActive: boolean;
  disponible: boolean;
  es_compra_bodega: boolean;
  compra_minima: number;
  unidad_fraccionamiento: number;
  distribucion_minima: number;
  venta_minima: number;
  createdAt: Date;
  updatedAt: Date;
  categoriaId: string;
}

export interface Sucursal {
  id: string;
  nombre: string;
  tipo: string;
  direccion_complemento: string;
  paisId: string;
  departamentoId: string;
  municipioId: string;
  gerenteId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
}

export interface Pais {
  id: string;
  nombre: string;
  code: string;
  code_phone: string;
  nombre_moneda: string;
  simbolo_moneda: string;
  nombre_documento: string;
  isActive: boolean;
}
