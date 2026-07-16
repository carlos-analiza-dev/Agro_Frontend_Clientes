export interface ResponseEmpleadosAgroInterface {
  empleados: EmpleadoAgro[];
  total: number;
}

export interface EmpleadoAgro {
  id: string;
  nombre: string;
  identificacion: string;
  telefono: string;
  email: string;
  direccion: string;
  sexo: string;
  creadoPorId: string;
  isActive: boolean;
  createdAt: Date;
  role: Role;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
  sucursal: Sucursal;
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

export interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Sucursal {
  id: string;
  nombre: string;
  tipo: string;
  latitud: string;
  longitud: string;
  direccion_complemento: string;
  paisId: string;
  departamentoId: string;
  municipioId: string;
  gerenteId: EmpleadoAgro | null;
  agroservicioId: string;
  creadoPorId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
