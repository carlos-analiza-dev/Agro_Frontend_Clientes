import {
  EstadoActividad,
  TipoActividad,
} from "@/interfaces/enums/actividaes.enums";
import { CheckCircle2, Clock } from "lucide-react";

export const getEstadoConfig = (estado: EstadoActividad) => {
  const configs = {
    pendiente: {
      label: "Pendiente",
      variant: "secondary" as const,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800",
    },
    en_proceso: {
      label: "En Proceso",
      variant: "default" as const,
      icon: Clock,
      color: "bg-blue-100 text-blue-800",
    },
    completada: {
      label: "Completada",
      variant: "default" as const,
      icon: CheckCircle2,
      color: "bg-green-100 text-green-800",
    },
    cancelada: {
      label: "Cancelada",
      variant: "destructive" as const,
      icon: Clock,
      color: "bg-red-100 text-red-800",
    },
  };
  return configs[estado as keyof typeof configs] || configs.pendiente;
};

export const getTipoIcon = (tipo: TipoActividad) => {
  const icons = {
    siembra: "🌱",
    reparacion: "🔧",
    limpieza: "🧹",
    mantenimiento: "⚙️",
    alimentacion: "🍖",
    vacunacion: "💉",
    cosecha: "🌾",
    otro: "📋",
  };
  return icons[tipo as keyof typeof icons] || "📋";
};
