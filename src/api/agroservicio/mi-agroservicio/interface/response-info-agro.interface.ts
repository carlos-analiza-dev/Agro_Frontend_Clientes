import { Cliente, ProfileImage } from "@/interfaces/auth/cliente";

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
  logo: ProfileImage;
}
