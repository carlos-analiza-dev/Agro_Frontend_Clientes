export interface CreateAgroSucursale {
  nombre: string;
  tipo: TipoSucursal;
  latitud?: number;
  longitud?: number;
  direccion_complemento: string;
  paisId: string;
  departamentoId: string;
  municipioId: string;
  gerenteId?: string;
}

export enum TipoSucursal {
  BODEGA = "bodega",
  CASA_MATRIZ = "casa_matriz",
  SUCURSAL = "sucursal",
}
