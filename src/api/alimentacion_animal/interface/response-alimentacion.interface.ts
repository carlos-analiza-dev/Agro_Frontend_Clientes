import { Animal } from "@/api/animales/interfaces/response-animales.interface";

export interface ResponseAlimentacionInterface {
  animal: Animal;
  alimentos: Alimento[];
}

export interface Alimento {
  id: string;
  tipoAlimento: string;
  origen: string;
  cantidad: string;
  unidad: string;
  costo_diario: string;
  fecha: string;
}

export interface Complemento {
  complemento: string;
}

export interface TipoAlimentacion {
  origen: string;
  alimento: string;
}
