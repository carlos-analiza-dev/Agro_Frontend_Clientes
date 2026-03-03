export interface CalcularRangoPesoInterface {
  edadMeses: number;
  animalId: string;
}

export interface ResponseRangoEdad {
  raza: string;
  edadConsultada: number;
  rangoEdad: string;
  pesoMinimoEsperado: number;
  pesoMaximoEsperado: number;
}
