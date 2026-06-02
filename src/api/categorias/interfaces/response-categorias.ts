export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  is_active: boolean;
  is_market: boolean;
  destacada: boolean;
  created_at: Date;
  updated_at: Date;
}
