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
