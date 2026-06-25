import {
  DeteccionCelo,
  IntensidadCelosAnimal,
} from "@/interfaces/enums/celos/celos-enums";

export interface CrearCeloInterface {
  animalId: string;
  fechaInicio: string;
  fechaFin: string;
  intensidad: IntensidadCelosAnimal;
  metodo_deteccion: DeteccionCelo;
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
