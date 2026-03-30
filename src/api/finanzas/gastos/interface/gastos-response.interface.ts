import { CategoriaGasto, MetodoPago } from "@/interfaces/enums/gastos.enums";

export interface GastosResponse {
  data: Gastos[];
  total: number;
  limit: number;
  offset: number;
  totalPages: number;
}

export interface Gastos {
  id: string;
  categoria: CategoriaGasto;
  fincaId: string;
  fincaNombre: string;
  especieId: string;
  especieNombre: string;
  razaId: string;
  razaNombre: string;
  concepto: string;
  descripcion: string;
  monto: number;
  fecha_gasto: string;
  metodo_pago: MetodoPago;
  registradoPorId: string;
  registradoPorNombre: string;
  notas: string;
  createdAt: Date;
  updatedAt: Date;
}
