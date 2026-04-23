import { Jornada } from "@/api/jornadas-trabajador/interface/response-jornadas.interface";
import { MoonIcon, StarIcon, SunIcon } from "lucide-react";

export const getHorasExtras = (selectedJornada: Jornada) => {
  const horas = [];
  if (parseFloat(selectedJornada.horasExtrasDiurnas) > 0) {
    horas.push({
      type: "Diurnas",
      value: selectedJornada.horasExtrasDiurnas,
      icon: SunIcon,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    });
  }
  if (parseFloat(selectedJornada.horasExtrasNocturnas) > 0) {
    horas.push({
      type: "Nocturnas",
      value: selectedJornada.horasExtrasNocturnas,
      icon: MoonIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    });
  }
  if (parseFloat(selectedJornada.horasExtrasFestivas) > 0) {
    horas.push({
      type: "Festivas",
      value: selectedJornada.horasExtrasFestivas,
      icon: StarIcon,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    });
  }
  return horas;
};
