export interface ResponseUsoEquiposInterface {
  total: number;
  limit: number;
  offset: number;
  usosEquipo: UsosEquipo[];
}

export interface UsosEquipo {
  id: string;
  fechaInicio: string;
  fechaFin: string;
  horasTrabajadas: string;
  equipo: Equipo;
  actividad: Actividad;
  operador: Operador;
}

export interface Actividad {
  id: string;
  descripcion: string;
}

export interface Equipo {
  id: string;
  nombre: string;
  codigoInterno: string;
  tipo: string;
  marca: string;
  modelo: string;
}

export interface Operador {
  id: string;
  nombre: string;
  email: string;
}
