import {
  EstadoActividad,
  FrecuenciaActividad,
  TipoActividad,
} from "@/interfaces/enums/actividaes.enums";

export const tiposActividad = [
  { value: TipoActividad.SIEMBRA, label: "🌱 Siembra" },
  { value: TipoActividad.REPARACION, label: "🔧 Reparación" },
  { value: TipoActividad.LIMPIEZA, label: "🧹 Limpieza" },
  { value: TipoActividad.MANTENIMIENTO, label: "⚙️ Mantenimiento" },
  { value: TipoActividad.ALIMENTACION, label: "🍖 Alimentación" },
  { value: TipoActividad.VACUNACION, label: "💉 Vacunación" },
  { value: TipoActividad.COSECHA, label: "🌾 Cosecha" },
  { value: TipoActividad.RIEGO, label: "💧 Riego" },
  { value: TipoActividad.PODA, label: "✂️ Poda" },
  { value: TipoActividad.FUMIGACION, label: "🦟 Fumigación" },
  { value: TipoActividad.OTRO, label: "📋 Otro" },
];

export const estadosActividad = [
  { value: EstadoActividad.PENDIENTE, label: "Pendiente" },
  { value: EstadoActividad.EN_PROCESO, label: "En Proceso" },
  { value: EstadoActividad.COMPLETADA, label: "Completada" },
  { value: EstadoActividad.CANCELADA, label: "Cancelada" },
];

export const frecuenciasActividad = [
  { value: FrecuenciaActividad.DIARIA, label: "Diaria" },
  { value: FrecuenciaActividad.SEMANAL, label: "Semanal" },
];
