export interface ResponseServicioReproductivoInterface {
  data: Servicio[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Servicio {
  id: string;
  tipo_servicio: string;
  estado: string;
  fecha_servicio: Date;
  numero_servicio: number;
  exitoso: boolean;
  hembra: Hembra;
  macho: Hembra;
  celo_asociado: CeloAsociado;
  detalles: Detalle[];
}

export interface CeloAsociado {
  id: string;
  fechaInicio: Date;
}

export interface Detalle {
  id: string;
  hora_servicio: string;
  numero_monta: number;
}

export interface Hembra {
  id: string;
  identificador: string;
}
