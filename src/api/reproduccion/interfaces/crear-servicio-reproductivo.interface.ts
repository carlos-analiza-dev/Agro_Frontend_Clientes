import {
  EstadoServicio,
  TipoServicio,
} from "@/interfaces/enums/servicios-reproductivos.enum";

export interface MetadataServicio {
  costo?: number;
  duracion_minutos?: number;
  condiciones_climaticas?: string;
  evaluacion_macho?: string;
}

export interface ComportamientoServicio {
  aceptacion_macho?: boolean;
  receptividad?: string;
  signos_observados?: string[];
}

export interface DetalleServicioReproductivo {
  hora_servicio: string;
  numero_monta: number;
  duracion_minutos?: number;
  observaciones_monta?: string;
  comportamiento?: ComportamientoServicio;
}

export interface CreateServicioReproductivoInterface {
  hembra_id: string;
  macho_id?: string;
  tipo_servicio: TipoServicio;
  estado?: EstadoServicio;
  fecha_servicio: string;
  numero_servicio?: number;
  celo_id?: string;
  dosis_semen?: string;
  proveedor_semen?: string;
  tecnico_responsable?: string;
  exitoso?: boolean;
  observaciones?: string;
  detalles?: DetalleServicioReproductivo[];
  metadata?: MetadataServicio;
}
