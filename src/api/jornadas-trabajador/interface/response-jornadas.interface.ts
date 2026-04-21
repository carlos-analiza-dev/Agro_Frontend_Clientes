export interface ResponseJornadasTrabajadoresInterface {
  jornadas: Jornada[];
  total: number;
  limit: number;
  offset: number;
}

export interface Jornada {
  id: string;
  trabajadorId: string;
  propietarioId: string;
  fecha: string;
  trabajo: boolean;
  laborRealizada: string;
  horasExtrasDiurnas: string;
  horasExtrasNocturnas: string;
  horasExtrasFestivas: string;
  observaciones: string;
  sincronizado: boolean;
  fechaSincronizacion: null;
  createdAt: Date;
  updatedAt: Date;
  trabajador: Trabajador;
}

export interface Trabajador {
  id: string;
  nombre: string;
  identificacion: string;
  telefono: string;
  email: string;
  direccion: string;
  sexo: string;
  verified: boolean;
  rol: string;
  isActive: boolean;
  createdAt: Date;
  propietarioId: string;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
  profileImages: ProfileImage[];
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
  municipios?: Departamento[];
}

export interface Pais {
  id: string;
  nombre: string;
  code: string;
  code_phone: string;
  nombre_moneda: string;
  simbolo_moneda: string;
  nombre_documento: string;
  isActive: boolean;
  departamentos: Departamento[];
}

export interface ProfileImage {
  id: string;
  url: string;
  key: string;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}
