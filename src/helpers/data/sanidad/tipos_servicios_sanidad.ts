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
} from "lucide-react";

export const tiposServiciosSanidadData = [
  // ===== TODAS LAS ESPECIES =====
  {
    id: 1,
    value: "Vacunacion",
    label: "Vacunación",
    especies: ["todas"],
    icon: Syringe,
  },
  {
    id: 2,
    value: "Desparasitacion",
    label: "Desparasitación",
    especies: ["todas"],
    icon: Pill,
  },

  // ===== BOVINOS =====
  {
    id: 3,
    value: "RevisionUbre",
    label: "Revisión de ubre",
    especies: ["bovino"],
    icon: Activity,
  },
  {
    id: 4,
    value: "AtencionPezunas",
    label: "Atención de pezuñas",
    especies: ["bovino"],
    icon: PawPrint,
  },
  {
    id: 5,
    value: "LimpiezaCorral",
    label: "Limpieza de corral",
    especies: ["bovino"],
    icon: Brush,
  },

  // ===== CAPRINOS =====
  {
    id: 6,
    value: "RevisionUbre",
    label: "Revisión de ubre",
    especies: ["caprino"],
    icon: Activity,
  },
  {
    id: 7,
    value: "AtencionPezunas",
    label: "Atención de pezuñas",
    especies: ["caprino"],
    icon: PawPrint,
  },
  {
    id: 8,
    value: "LimpiezaCorral",
    label: "Limpieza de corral",
    especies: ["caprino"],
    icon: Brush,
  },

  // ===== OVINOS =====
  {
    id: 9,
    value: "Esquila",
    label: "Esquila",
    especies: ["ovino"],
    icon: Scissors,
  },
  {
    id: 10,
    value: "BanoSanitario",
    label: "Baño sanitario",
    especies: ["ovino"],
    icon: Droplets,
  },
  {
    id: 11,
    value: "AtencionPezunas",
    label: "Atención de pezuñas",
    especies: ["ovino"],
    icon: PawPrint,
  },
  {
    id: 12,
    value: "LimpiezaCorral",
    label: "Limpieza de corral",
    especies: ["ovino"],
    icon: Brush,
  },

  // ===== PORCINOS =====
  {
    id: 13,
    value: "ControlMortalidad",
    label: "Registro de bajas / mortalidad",
    especies: ["porcino"],
    icon: Skull,
  },
  {
    id: 14,
    value: "LimpiezaCorral",
    label: "Limpieza de corral",
    especies: ["porcino"],
    icon: Brush,
  },

  // ===== EQUINOS =====
  {
    id: 15,
    value: "Odontologia",
    label: "Odontología",
    especies: ["equino"],
    icon: Smile, // Cambiado a Smile ✅
  },
  {
    id: 16,
    value: "AtencionCascos",
    label: "Atención de cascos",
    especies: ["equino"],
    icon: Footprints,
  },
  {
    id: 17,
    value: "RevisionLesiones",
    label: "Revisión de lesiones",
    especies: ["equino"],
    icon: Stethoscope,
  },
  {
    id: 18,
    value: "EvaluacionCondicionCorporal",
    label: "Evaluación de condición corporal",
    especies: ["equino"],
    icon: Scale,
  },

  // ===== AVES =====
  {
    id: 19,
    value: "ControlMortalidad",
    label: "Registro de bajas / mortalidad",
    especies: ["avicola"],
    icon: Skull,
  },
  {
    id: 20,
    value: "CambioCamaNido",
    label: "Cambio de cama / nido",
    especies: ["avicola"],
    icon: Warehouse,
  },
  {
    id: 21,
    value: "ControlProduccion",
    label: "Control de producción",
    especies: ["avicola"],
    icon: ChartBar,
  },
  {
    id: 22,
    value: "LimpiezaGalpon",
    label: "Limpieza de galpón",
    especies: ["avicola"],
    icon: Home,
  },

  // ===== PECES =====
  {
    id: 23,
    value: "ControlCalidadAgua",
    label: "Control de calidad del agua",
    especies: ["peces"],
    icon: Droplet,
  },
  {
    id: 24,
    value: "RecambioAgua",
    label: "Recambio de agua",
    especies: ["peces"],
    icon: Droplet,
  },
  {
    id: 25,
    value: "MuestreoBiometrico",
    label: "Muestreo biométrico",
    especies: ["peces"],
    icon: Ruler,
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
