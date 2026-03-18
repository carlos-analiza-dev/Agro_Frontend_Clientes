export interface CrearCeloInterface {
  animalId: string;
  fechaInicio: string;
  fechaFin: string;
  /*   numeroCelo?: number; */
  intensidad: string;
  metodo_deteccion: string;
  observaciones: string;
  signos_observados: SignosObservados;
}

export interface SignosObservados {
  monta_otros: boolean;
  acepta_monta: boolean;
  inquietud: boolean;
  secreciones: string;
  vulva_inflamada: boolean;
  otros: string[];
}
