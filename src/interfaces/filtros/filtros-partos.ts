import { EstadoParto, TipoParto } from "../enums/partos.enums";

export interface FiltrosPartos {
  finca_id?: string;

  hembra_id?: string;

  tipo_parto?: TipoParto;

  estado?: EstadoParto;

  fecha_desde?: Date;

  fecha_hasta?: Date;

  page?: number;

  limit?: number;
}
