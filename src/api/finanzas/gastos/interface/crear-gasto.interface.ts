import { CategoriaGasto, MetodoPago } from "@/interfaces/enums/gastos.enums";

export interface CrearGastoInterface {
  categoria: CategoriaGasto;
  fincaId: string;
  especieId?: string;
  razaId?: string;
  concepto: string;
  descripcion: string;
  monto: number;
  fecha_gasto: string;
  metodo_pago: MetodoPago;
  notas: string;
}
