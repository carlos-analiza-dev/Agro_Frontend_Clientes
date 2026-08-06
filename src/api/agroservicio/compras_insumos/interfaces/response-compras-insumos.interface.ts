import { AgroInsumo } from "../../insumos/interfaces/response-agro-insumos.interface";
import { ResponseInfoAgro } from "../../mi-agroservicio/interface/response-info-agro.interface";
import { TipoPagoProveedor } from "../../proveedores/interface/response-agro-proveedores.interface";

export interface ResponseInsumosinteface {
  compras: CompraAgroInsumo[];
  total: number;
}

export interface CompraAgroInsumo {
  id: string;
  proveedorId: string;
  sucursalId: string;
  tipo_pago: TipoPagoProveedor;
  subtotal: string;
  impuestos: string;
  descuentos: string;
  total: string;
  numero_factura: string;
  fecha: string;
  created_at: string;
  updated_at: string;
  paisId: string;
  createdById: string;
  updatedById: string;
  detalles: Detalle[];
  lotes: Lote[];
  proveedor: Proveedor;
  sucursal: Sucursal;
  agroservicio: ResponseInfoAgro;
}

export interface Detalle {
  id: string;
  compraId: string;
  insumoId: string;
  costo_por_unidad: string;
  cantidad: string;
  bonificacion: string;
  cantidad_total: string;
  descuentos: string;
  impuestos: string;
  monto_total: string;
  insumo: AgroInsumo;
}

export interface Lote {
  id: string;
  compraId: string;
  sucursalId: string;
  insumoId: string;
  cantidad: string;
  costo: string;
  costo_por_unidad: string;
}

export interface Proveedor {
  id: string;
  nit_rtn: string;
  nrc: string;
  nombre_legal: string;
  complemento_direccion: string;
  telefono: string;
  correo: string;
  nombre_contacto: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
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
}
