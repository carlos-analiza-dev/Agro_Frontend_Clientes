// src/helpers/data/sanidad/tipos_servicios_sanidad.ts
import {
  Syringe,
  Pill,
  Activity,
  PawPrint,
  Brush,
  Scissors,
  Droplets,
  Skull,
  Smile,
  Footprints,
  Stethoscope,
  Scale,
  Warehouse,
  ChartBar,
  Droplet,
  Ruler,
  Home,
  BrushCleaning,
} from "lucide-react";

export const tiposServiciosSanidadData = [
  // ===== TODAS LAS ESPECIES =====
  {
    id: 1,
    value: "Vacunacion",
    especies: ["todas"],
    icon: Syringe,
  },
  {
    id: 2,
    value: "Desparasitacion",
    especies: ["todas"],
    icon: Pill,
  },

  // ===== BOVINOS =====
  {
    id: 3,
    value: "RevisionUbre",
    especies: ["bovino"],
    icon: Activity,
  },
  {
    id: 4,
    value: "AtencionPezunas",
    especies: ["bovino"],
    icon: PawPrint,
  },
  {
    id: 5,
    value: "LimpiezaCorral",
    especies: ["bovino"],
    icon: Brush,
  },

  // ===== CAPRINOS =====
  {
    id: 6,
    value: "RevisionUbre",
    especies: ["caprino"],
    icon: Activity,
  },
  {
    id: 7,
    value: "AtencionPezunas",
    especies: ["caprino"],
    icon: PawPrint,
  },
  {
    id: 8,
    value: "LimpiezaCorral",
    especies: ["caprino"],
    icon: Brush,
  },

  // ===== OVINOS =====
  {
    id: 9,
    value: "Esquila",
    especies: ["ovino"],
    icon: Scissors,
  },
  {
    id: 10,
    value: "BanoSanitario",
    especies: ["ovino"],
    icon: Droplets,
  },
  {
    id: 11,
    value: "AtencionPezunas",
    especies: ["ovino"],
    icon: PawPrint,
  },
  {
    id: 12,
    value: "LimpiezaCorral",
    especies: ["ovino"],
    icon: Brush,
  },

  // ===== PORCINOS =====
  {
    id: 13,
    value: "ControlMortalidad",
    especies: ["porcino"],
    icon: Skull,
  },
  {
    id: 14,
    value: "LimpiezaCorral",
    especies: ["porcino"],
    icon: Brush,
  },

  // ===== EQUINOS =====
  {
    id: 15,
    value: "Odontologia",
    especies: ["equino"],
    icon: Smile,
  },
  {
    id: 16,
    value: "AtencionCascos",
    especies: ["equino"],
    icon: Footprints,
  },
  {
    id: 17,
    value: "RevisionLesiones",
    especies: ["equino"],
    icon: Stethoscope,
  },
  {
    id: 18,
    value: "EvaluacionCondicionCorporal",
    especies: ["equino"],
    icon: Scale,
  },

  // ===== AVES =====
  {
    id: 19,
    value: "ControlMortalidad",
    especies: ["avicola"],
    icon: Skull,
  },
  {
    id: 20,
    value: "CambioCamaNido",
    especies: ["avicola"],
    icon: Warehouse,
  },
  {
    id: 21,
    value: "ControlProduccion",
    especies: ["avicola"],
    icon: ChartBar,
  },
  {
    id: 22,
    value: "LimpiezaGalpon",
    especies: ["avicola"],
    icon: Home,
  },

  // ===== PECES =====
  {
    id: 23,
    value: "ControlCalidadAgua",
    especies: ["peces"],
    icon: Droplet,
  },
  {
    id: 24,
    value: "RecambioAgua",
    especies: ["peces"],
    icon: Droplet,
  },
  {
    id: 25,
    value: "MuestreoBiometrico",
    especies: ["peces"],
    icon: Ruler,
  },
  {
    id: 26,
    value: "Sifoneo",
    especies: ["peces"],
    icon: BrushCleaning,
  },
];

export const COLORS_SANIDAD = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
];
