import { MetodoPago } from "@/interfaces/enums/gastos.enums";
import { CategoriaIngreso } from "@/interfaces/enums/ingresos.enums";

export interface ResponseIngresosInterface {
  data: Ingreso[];
  total: number;
  limit: number;
  offset: number;
  totalPages: number;
}

export interface Ingreso {
  id: string;
  categoria: CategoriaIngreso;
  fincaId: string;
  fincaNombre: string;
  especieId: string;
  especieNombre: string;
  razaId: string;
  razaNombre: string;
  concepto: string;
  descripcion: string;
  monto: number;
  fecha_ingreso: string;
  metodo_pago: MetodoPago;
  registradoPorId: string;
  registradoPorNombre: string;
  notas: string;
  createdAt: Date;
  updatedAt: Date;
}
