import { Cliente } from "@/interfaces/auth/cliente";

export interface ResponseInfoAgro {
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
  propietario: Cliente;
  logo: LogoImage;
}

export interface LogoImage {
  id: string;
  agroservicioId: string;
  url: string;
  key: string;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}
