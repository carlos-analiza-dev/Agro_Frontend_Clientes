import {
  EstadoServicio,
  TipoServicio,
} from "@/interfaces/enums/servicios-reproductivos.enum";

export interface Metadata {
  costo?: number;
  duracion_minutos?: number;
  condiciones_climaticas?: string;
  evaluacion_macho?: string;
}

export interface Comportamiento {
  aceptacion_macho?: boolean;
  receptividad?: string;
  signos_observados?: string[];
}

export interface DetallesServicioReproductivo {
  hora_servicio: string;
  numero_monta: number;
  duracion_minutos?: number;
  observaciones_monta?: string;
  comportamiento?: Comportamiento;
}

export interface CreateServiciosReproductivo {
  hembra_id: string;
  macho_id?: string | undefined;
  macho_externo_nombre?: string;
  macho_pertenece_finca: boolean;
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
  detalles?: DetallesServicioReproductivo[];
  metadata?: Metadata;
}
