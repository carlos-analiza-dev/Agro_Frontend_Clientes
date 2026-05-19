export interface ResponsePaquetesInterface {
  id: string;
  nombre: string;
  tipo: string;
  maxFincas: number;
  maxAnimales: number;
  maxTrabajadores: number;
  isActive: boolean;
  preciosPorPais: PreciosPorPai[];
}

export interface PreciosPorPai {
  id: string;
  precioMensual: string;
  precioAnual: string;
  isActive: boolean;
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
}
