import {
  EstadoParto,
  SexoCria,
  TipoParto,
} from "@/interfaces/enums/partos.enums";

export interface CrearPartoInterface {
  hembra_id: string;
  servicio_id: string;
  fecha_parto: string;
  numero_parto: number;
  tipo_parto: TipoParto;
  estado: EstadoParto;
  numero_crias: number;
  numero_crias_vivas: number;
  numero_crias_muertas: number;
  observaciones: string;
  complicaciones: string;
  atencion_veterinaria: string;
  veterinario_responsable: string;
  crias: Cria[];
}

export interface Cria {
  sexo: SexoCria;
  peso: number;
  estado: string;
  observaciones: string;
  identificador: string;
  fecha_nacimiento: string;
}
