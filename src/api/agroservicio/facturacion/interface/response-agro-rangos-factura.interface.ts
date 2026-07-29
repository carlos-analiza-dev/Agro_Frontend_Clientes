export interface ResponseAgroRangosFacturaInterface {
  data: Rangos[];
  total: number;
  limit: number;
  offset: number;
  totalPages: number;
}

export interface Rangos {
  id: string;
  cai: string;
  prefijo: string;
  rango_inicial: number;
  rango_final: number;
  correlativo_actual: number;
  fecha_recepcion: string;
  fecha_limite_emision: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  agroservicio: Agroservicio;
}

export interface Agroservicio {
  id: string;
  nombre_agroservicio: string;
  rtn: string;
  propietarioId: string;
  paisId: string;
  correo: string;
  telefono: string;
  direccion: string;
  created_at: Date;
  updated_at: Date;
}
