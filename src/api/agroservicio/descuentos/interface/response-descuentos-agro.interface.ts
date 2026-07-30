import { LogoImage } from "../../mi-agroservicio/interface/response-info-agro.interface";

export interface ResponseDescuentosAgroInterface {
  id: string;
  nombre: string;
  porcentaje: number;
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
  created_at: string;
  updated_at: string;
  logo: LogoImage;
}
