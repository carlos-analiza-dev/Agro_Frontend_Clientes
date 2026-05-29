export interface ResponseSubcategorias {
  data: SubCategoria[];
  total: number;
  limit: number;
  offset: number;
}

export interface SubCategoria {
  id: string;
  nombre: string;
  descripcion: string;
  codigo: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  categoria: Categoria;
  created_by: AtedBy;
  updated_by: AtedBy;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AtedBy {
  id: string;
  email: string;
  name: string;
  identificacion: string;
  direccion: string;
  sexo: string;
  telefono: string;
  isActive: boolean;
  isAuthorized: boolean;
  createdAt: Date;
}
