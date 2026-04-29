import {
  EstadoActividad,
  FrecuenciaActividad,
  TipoActividad,
} from "@/interfaces/enums/actividaes.enums";

export interface CrearActividadInterface {
  trabajadorId: string;
  fincaId: string;
  fecha: string;
  tipo: TipoActividad;
  estado: EstadoActividad;
  frecuencia: FrecuenciaActividad;
  descripcion: string;
}
