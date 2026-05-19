export interface PaqueteInterface {
  id: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  paquete: Paquete;
}

export interface Paquete {
  id: string;
  nombre: string;
  tipo: string;
  maxFincas: number;
  maxAnimales: number;
  maxTrabajadores: number;
  isActive: boolean;
}
