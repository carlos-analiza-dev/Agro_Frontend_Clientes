import { Cliente } from "@/interfaces/auth/cliente";
import { Sanidad } from "./response-sanidad-animal.interface";

export interface ResponseCambiosSanidadHistorial {
  historial: Historial[];
  total: number;
}

export interface Historial {
  id: string;
  sanidadId: string;
  fecha_anterior: string;
  fecha_nueva: string;
  motivo_cambio: string;
  tipo_cambio: string;
  usuario: string;
  dias_diferencia: number;
  fecha_cambio: string;
  actualizadoPorId: string;
  sanidad: Sanidad;
  actualizado_por: Cliente;
}
