import { TourStep } from "@/components/agroservicio/guia/TourGuide";
import { TipoPaquete } from "@/interfaces/enums/paquetes/paquetes.enum";
import { agroGestionSteps } from "@/interfaces/guias/steps_agro_gestion.interface";
import { agroLightSteps } from "@/interfaces/guias/steps_agro_light.interface";

export const getAgroTourSteps = (
  tipoAgroservicio: TipoPaquete,
): Record<string, TourStep[]> => {
  if (tipoAgroservicio === TipoPaquete.AGRO_GESTION) {
    return agroGestionSteps;
  }
  return agroLightSteps;
};

export const isRouteAvailable = (
  path: string,
  tipoAgroservicio: TipoPaquete,
): boolean => {
  const steps = getAgroTourSteps(tipoAgroservicio);
  return steps.hasOwnProperty(path);
};

export const getAvailableRoutes = (tipoAgroservicio: TipoPaquete): string[] => {
  const steps = getAgroTourSteps(tipoAgroservicio);
  return Object.keys(steps);
};
