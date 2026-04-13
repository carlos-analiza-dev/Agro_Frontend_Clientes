export interface ResposeFincasAsignadasTrabajador {
  id: string;
  fechaAsignacion: Date;
  trabajador: AsignadoPor;
  finca: Finca;
  asignadoPor: AsignadoPor;
}

export interface AsignadoPor {
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
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
  profileImages: ProfileImage[];
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
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
}

export interface ProfileImage {
  id: string;
  url: string;
  key: string;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Finca {
  id: string;
  nombre_finca: string;
  cantidad_animales: number;
  ubicacion: string;
  latitud: number;
  longitud: number;
  abreviatura: string;
  tamaño_total: string;
  area_ganaderia: string;
  medida_finca: string;
  tipo_explotacion: TipoExplotacion[];
  especies_maneja: EspeciesManeja[];
  fecha_registro: Date;
  isActive: boolean;
}

export interface EspeciesManeja {
  especie: string;
  cantidad: number;
}

export interface TipoExplotacion {
  tipo_explotacion: string;
}
