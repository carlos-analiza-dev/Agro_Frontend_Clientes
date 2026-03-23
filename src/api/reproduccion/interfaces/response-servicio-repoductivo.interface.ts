import { TipoServicio } from "@/interfaces/enums/servicios-reproductivos.enum";
import { Metadata } from "./crear-servicio-reproductivo.interface";

export interface ResponseServicioReproductivoInterface {
  data: Servicio[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Servicio {
  id: string;
  tipo_servicio: TipoServicio;
  estado: string;
  fecha_servicio: string;
  numero_servicio: number;
  dosis_semen?: string;
  proveedor_semen?: string;
  tecnico_responsable?: string;
  observaciones?: string;
  metadata: Metadata;
  exitoso: boolean;
  macho_pertenece_finca: boolean;
  macho_externo_nombre?: string;
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
