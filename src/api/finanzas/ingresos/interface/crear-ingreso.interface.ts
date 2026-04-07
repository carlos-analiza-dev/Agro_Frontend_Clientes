import { CategoriaIngreso } from "@/interfaces/enums/ingresos.enums";

export interface CrearIngresoInterface {
  categoria: CategoriaIngreso;
  fincaId: string;
  especieId?: string;
  razaId?: string;
  concepto: string;
  descripcion: string;
  monto: number;
  fecha_ingreso: string;
  metodo_pago: string;
  notas: string;
}
