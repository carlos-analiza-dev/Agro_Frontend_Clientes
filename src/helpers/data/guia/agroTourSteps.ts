import { TourStep } from "@/components/agroservicio/guia/TourGuide";
import { TipoPaquete } from "@/interfaces/enums/paquetes/paquetes.enum";
import { agroGestionSteps } from "@/interfaces/guias/steps_agro_gestion.interface";
import { agroLightSteps } from "@/interfaces/guias/steps_agro_light.interface";
import { agroGestionStepsEmpleados } from "@/interfaces/guias/steps_agro_empleados.interface";
import { TOUR_PAGES_EMPLOYES_ORDER } from "./tourGuide";
import { agroGestionStepsEn } from "@/interfaces/guias/steps_agro_gestionEn.interface";
import { agroLightStepsEn } from "@/interfaces/guias/steps_agro_lightEn.interface";
import { agroGestionStepsEmpleadosEn } from "@/interfaces/guias/steps_agro_empleadosEn.interface";

type Locale = "es" | "en";

interface PermisoEmpleado {
  url: string;
  isActive: boolean;
  permiso?: {
    url: string;
    isActive: boolean;
  };
}

export const ordenarPermisosEmpleado = (
  permisos: PermisoEmpleado[] = [],
): string[] => {
  const urlsPermitidas = new Set(
    permisos
      .filter((permiso) => {
        const isActive =
          permiso.isActive !== undefined
            ? permiso.isActive
            : permiso.permiso?.isActive !== false;
        return isActive;
      })
      .map((permiso) => permiso.permiso?.url || permiso.url)
      .filter(Boolean),
  );

  return TOUR_PAGES_EMPLOYES_ORDER.filter((url) => urlsPermitidas.has(url));
};

export const getPropietarioTourSteps = (
  tipoAgroservicio: TipoPaquete,
  locale: Locale = "es",
): Record<string, TourStep[]> => {
  if (tipoAgroservicio === TipoPaquete.AGRO_GESTION) {
    return locale === "en" ? agroGestionStepsEn : agroGestionSteps;
  }
  return locale === "en" ? agroLightStepsEn : agroLightSteps;
};

export const getEmpleadoTourSteps = (
  permisosEmpleados: PermisoEmpleado[] = [],
  locale: Locale = "es",
): Record<string, TourStep[]> => {
  const rutasPermitidas = ordenarPermisosEmpleado(permisosEmpleados);
  const stepsPorIdioma =
    locale === "en" ? agroGestionStepsEmpleadosEn : agroGestionStepsEmpleados;

  const steps: Record<string, TourStep[]> = {};

  rutasPermitidas.forEach((ruta) => {
    if (stepsPorIdioma[ruta]) {
      steps[ruta] = stepsPorIdioma[ruta];
    }
  });

  return steps;
};

export const getAgroTourSteps = (
  tipoAgroservicio: TipoPaquete,
  esEmpleado: boolean = false,
  permisosEmpleados: PermisoEmpleado[] = [],
  locale: Locale = "es",
): Record<string, TourStep[]> => {
  if (esEmpleado) {
    return getEmpleadoTourSteps(permisosEmpleados, locale);
  }

  return getPropietarioTourSteps(tipoAgroservicio, locale);
};

export const getCurrentTourSteps = (
  pathname: string,
  tipoAgroservicio: TipoPaquete,
  esEmpleado: boolean = false,
  permisosEmpleados: PermisoEmpleado[] = [],
  locale: Locale = "es",
): TourStep[] => {
  const allSteps = getAgroTourSteps(
    tipoAgroservicio,
    esEmpleado,
    permisosEmpleados,
    locale,
  );
  return allSteps[pathname] || [];
};

export const isRouteAvailable = (
  path: string,
  tipoAgroservicio: TipoPaquete,
  esEmpleado = false,
  permisosEmpleados: PermisoEmpleado[] = [],
  locale: Locale = "es",
): boolean => {
  const steps = getAgroTourSteps(
    tipoAgroservicio,
    esEmpleado,
    permisosEmpleados,
    locale,
  );

  return Object.prototype.hasOwnProperty.call(steps, path);
};

export const getAvailableRoutes = (
  tipoAgroservicio: TipoPaquete,
  esEmpleado = false,
  permisosEmpleados: PermisoEmpleado[] = [],
  locale: Locale = "es",
): string[] => {
  const steps = getAgroTourSteps(
    tipoAgroservicio,
    esEmpleado,
    permisosEmpleados,
    locale,
  );

  return Object.keys(steps);
};
