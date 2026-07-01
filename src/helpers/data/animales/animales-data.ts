import { EtapaAvicola } from "@/api/animales/interfaces/crear-avicola.interface";
import { EtapaPez } from "@/api/animales/interfaces/crear-peces.interface";
import { TipoAve } from "@/interfaces/enums/animales/animales-enums";

export const tipoAveOptions = [
  { label: "Engorde", value: TipoAve.ENGORDE },
  { label: "Ponedora", value: TipoAve.PONEDORA },
  { label: "Reproductora", value: TipoAve.REPRODUCTORA },
  { label: "Pollita", value: TipoAve.POLLITA },
  { label: "Descartes", value: TipoAve.DESCARTE },
];

export const alimentoOptionsAves = [
  {
    label: "Concentrado",
    value: "concentrado",
    origenes: [
      { label: "Comprado", value: "comprado" },
      { label: "Producido", value: "producido" },
      { label: "Comprado y producido", value: "comprado y producido" },
    ],
  },
  {
    label: "Maíz",
    value: "maiz",
    origenes: [
      { label: "Comprado", value: "comprado" },
      { label: "Producido", value: "producido" },
      { label: "Comprado y producido", value: "comprado y producido" },
    ],
  },
  {
    label: "Soya",
    value: "soya",
    origenes: [
      { label: "Comprado", value: "comprado" },
      { label: "Producido", value: "producido" },
      { label: "Comprado y producido", value: "comprado y producido" },
    ],
  },
  {
    label: "Sorgo",
    value: "sorgo",
    origenes: [
      { label: "Comprado", value: "comprado" },
      { label: "Producido", value: "producido" },
      { label: "Comprado y producido", value: "comprado y producido" },
    ],
  },
  {
    label: "Pastoreo",
    value: "pastoreo",
    origenes: [
      { label: "Comprado", value: "comprado" },
      { label: "Producido", value: "producido" },
      { label: "Comprado y producido", value: "comprado y producido" },
    ],
  },
  {
    label: "Balanceado",
    value: "balanceado",
    origenes: [
      { label: "Comprado", value: "comprado" },
      { label: "Producido", value: "producido" },
      { label: "Comprado y producido", value: "comprado y producido" },
    ],
  },
  {
    label: "Otro",
    value: "otro",
    origenes: [
      { label: "Comprado", value: "comprado" },
      { label: "Producido", value: "producido" },
      { label: "Comprado y producido", value: "comprado y producido" },
    ],
  },
];

export const calificacionHuevosOptions = [
  { label: "Extra", value: "extra" },
  { label: "A", value: "a" },
  { label: "B", value: "b" },
  { label: "C", value: "c" },
];

export const etapaOptions = [
  { value: EtapaPez.ALEVIN, label: "Alevín" },
  { value: EtapaPez.JUVENIL, label: "Juvenil" },
  { value: EtapaPez.ENGORDE, label: "Engorde" },
];

export const sexoCaprinoOptions = [
  { label: "Macho entero", value: "Macho" },
  { label: "Hembra", value: "Hembra" },
];

export const edadCaprinoOptions = [
  { label: "Cabrito (0-4 m)", value: 1 },
  { label: "Cabrita / Cabrito de levante", value: 2 },
  { label: "Adulto", value: 3 },
  { label: "Reproductor", value: 4 },
];

export const condicionCorporalOptions = [
  { label: "1 - Muy delgada", value: "1" },
  { label: "2 - Delgada", value: "2" },
  { label: "3 - Ideal", value: "3" },
  { label: "4 - Gorda", value: "4" },
  { label: "5 - Obesa", value: "5" },
];

export const propositoCaprinoOptions = [
  { label: "Leche", value: "leche" },
  { label: "Carne", value: "carne" },
  { label: "Doble propósito", value: "doble_proposito" },
  { label: "Reproductor", value: "reproductor" },
  { label: "Cría", value: "cria" },
];

export const tipoAlimentacionCaprinoOptions = [
  { label: "Pastoreo", value: "pastoreo" },
  { label: "Forraje", value: "forraje" },
  { label: "Concentrado", value: "concentrado" },
  { label: "Minerales", value: "minerales" },
  { label: "Suplementos", value: "suplementos" },
];

export const edadOvinoOptions = [
  { label: "Cordero (0-4 meses)", value: 1 },
  { label: "Ovino joven (4-12 meses)", value: 2 },
  { label: "Adulto", value: 3 },
  { label: "Reproductor", value: 4 },
];

export const categoriaEdadOptions = [
  { label: "Cordero", value: "cordero" },
  { label: "Primavera", value: "primavera" },
  { label: "Adulto joven", value: "adulto_joven" },
  { label: "Adulto", value: "adulto" },
  { label: "Viejo", value: "viejo" },
];

export const tipoNacimientoOptions = [
  { label: "Simple", value: "simple" },
  { label: "Doble", value: "doble" },
  { label: "Triple", value: "triple" },
  { label: "Cuádruple", value: "cuadruple" },
];

export const propositoOvinoOptions = [
  { label: "Lana", value: "lana" },
  { label: "Carne", value: "carne" },
  { label: "Leche", value: "leche" },
  { label: "Doble propósito", value: "doble_proposito" },
  { label: "Reproductor", value: "reproductor" },
  { label: "Cría", value: "cria" },
];

export const etapaAvicolaOptions = [
  { value: EtapaAvicola.RECEPCION, label: "Recepción" },
  { value: EtapaAvicola.CRIA, label: "Cría" },
  { value: EtapaAvicola.CRECIMIENTO, label: "Crecimiento" },
  { value: EtapaAvicola.ENGORDE, label: "Engorde" },
  { value: EtapaAvicola.AYUNO, label: "Ayuno" },
];

export const sexoPorcinoOptions = [
  { value: "Macho", label: "Macho" },
  { value: "Hembra", label: "Hembra" },
];

export const tipoRegistroPorcinoOptions = [
  { value: "Puro", label: "Puro" },
  { value: "Cruce", label: "Cruce" },
  { value: "Comercial", label: "Comercial" },
  { value: "Registro", label: "Registro" },
  { value: "Certificado", label: "Certificado" },
];

export const etapaPorcinoOptions = [
  { value: "Lactancia", label: "Lactancia" },
  { value: "Destete", label: "Destete" },
  { value: "Recría", label: "Recría" },
  { value: "Engorde", label: "Engorde" },
  { value: "Reproducción", label: "Reproducción" },
];

export const tipoAlimentacionPorcinoOptions = [
  { value: "Concentrados", label: "Concentrados" },
  { value: "Granos", label: "Granos" },
  { value: "Forrajes", label: "Forrajes" },
  { value: "Suplementos", label: "Suplementos" },
  { value: "Balanceados", label: "Balanceados" },
];
