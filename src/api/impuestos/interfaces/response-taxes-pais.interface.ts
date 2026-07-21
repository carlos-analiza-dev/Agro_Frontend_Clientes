export interface ResponseTaxesInterface {
  id: string;
  nombre: string;
  porcentaje: string;
  pais: Pais;
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

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
  municipios?: Departamento[];
}
