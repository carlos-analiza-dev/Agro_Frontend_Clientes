import { TourStep } from "@/components/agroservicio/guia/TourGuide";
import { TipoPaquete } from "@/interfaces/enums/paquetes/paquetes.enum";
import { agroGestionSteps } from "@/interfaces/guias/steps_agro_gestion.interface";
import { agroLightSteps } from "@/interfaces/guias/steps_agro_light.interface";
import { TOUR_PAGES_EMPLOYES_ORDER } from "./tourGuide";
import { agroGestionStepsEmpleados } from "@/interfaces/guias/steps_agro_empleados.interface";

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
): Record<string, TourStep[]> => {
  if (tipoAgroservicio === TipoPaquete.AGRO_GESTION) {
    return agroGestionSteps;
  }
  return agroLightSteps;
};

export const getEmpleadoTourSteps = (
  permisosEmpleados: PermisoEmpleado[] = [],
): Record<string, TourStep[]> => {
  const rutasPermitidas = ordenarPermisosEmpleado(permisosEmpleados);

  const steps: Record<string, TourStep[]> = {};

  rutasPermitidas.forEach((ruta) => {
    if (agroGestionStepsEmpleados[ruta]) {
      steps[ruta] = agroGestionStepsEmpleados[ruta];
    }
  });

  return steps;
};

export const getAgroTourSteps = (
  tipoAgroservicio: TipoPaquete,
  esEmpleado: boolean = false,
  permisosEmpleados: PermisoEmpleado[] = [],
): Record<string, TourStep[]> => {
  if (esEmpleado) {
    return getEmpleadoTourSteps(permisosEmpleados);
  }

  return getPropietarioTourSteps(tipoAgroservicio);
};

export const getCurrentTourSteps = (
  pathname: string,
  tipoAgroservicio: TipoPaquete,
  esEmpleado: boolean = false,
  permisosEmpleados: PermisoEmpleado[] = [],
): TourStep[] => {
  const allSteps = getAgroTourSteps(
    tipoAgroservicio,
    esEmpleado,
    permisosEmpleados,
  );
  return allSteps[pathname] || [];
};

export const isRouteAvailable = (
  path: string,
  tipoAgroservicio: TipoPaquete,
  esEmpleado = false,
  permisosEmpleados: PermisoEmpleado[] = [],
): boolean => {
  const steps = getAgroTourSteps(
    tipoAgroservicio,
    esEmpleado,
    permisosEmpleados,
  );

  return Object.prototype.hasOwnProperty.call(steps, path);
};

export const getAvailableRoutes = (
  tipoAgroservicio: TipoPaquete,
  esEmpleado = false,
  permisosEmpleados: PermisoEmpleado[] = [],
): string[] => {
  const steps = getAgroTourSteps(
    tipoAgroservicio,
    esEmpleado,
    permisosEmpleados,
  );

  return Object.keys(steps);
};
