export interface ResponseSucursalesAgro {
  sucursales: Sucursale[];
  total: number;
}

export interface Sucursale {
  id: string;
  nombre: string;
  tipo: string;
  latitud: string;
  longitud: string;
  direccion_complemento: string;
  createdAt: Date;
  pais: Departamento;
  departamento: Departamento;
  municipio: Departamento;
  gerente: null;
}

export interface Departamento {
  id: string;
  nombre: string;
}
