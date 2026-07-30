export interface ResponseClientesAgro {
  total: number;
  limit: number;
  offset: number;
  clientes: ClienteAgro[];
}

export interface ClienteAgro {
  id: string;
  nombre: string;
  identificacion: string;
  telefono: string;
  email: string;
  direccion: string;
  sexo: string;
  isActive: boolean;
  fecha: Date;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
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
