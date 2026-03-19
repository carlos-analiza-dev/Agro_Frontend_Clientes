import {
  EstadoServicio,
  TipoServicio,
} from "../enums/servicios-reproductivos.enum";

export interface FiltrosServicios {
  hembra_id?: string;
  finca_id?: string;

  tipo_servicio?: TipoServicio;

  estado?: EstadoServicio;

  fecha_desde?: string;

  fecha_hasta?: string;

  exitoso?: boolean;

  con_gestacion?: boolean;

  page?: number;

  limit?: number;
}
