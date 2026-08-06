import { Agroservicio } from "../../proveedores/interface/response-agro-proveedores.interface";

export interface ImpuestosAgroProductosInterface {
  id: string;
  nombre: string;
  porcentaje: string;
  agroservicio: Agroservicio;
}
