export interface CrearClienteAgroInterface {
  nombre: string;
  identificacion: string;
  telefono: string;
  email: string;
  direccion: string;
  sexo: string;
  departamentoId: string;
  municipioId: string;
  isActive?: boolean;
}
