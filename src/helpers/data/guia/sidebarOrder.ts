import { ResponsePermisosInterface } from "@/api/permisos/interface/response-permisos.interface";
import { TourStep } from "@/components/agroservicio/guia/TourGuide";
import { agroClientesSteps } from "@/interfaces/guias/steps_agro_clientes.interface";
import { TOUR_PAGES_CLIENTES_ORDER } from "./tourGuide";

const RUTAS_SIEMPRE_DISPONIBLES = [
  "/panel",
  "/mi-plan",
  /*  "/comprar-plan", */
  "/codigo-cliente",
];

export const ordenarPermisosClientes = (
  permisos: ResponsePermisosInterface[] = [],
): string[] => {
  const urlsPermitidas = new Set(
    permisos
      .filter((permiso) => permiso.ver === true)
      .map((permiso) => permiso.permiso?.url)
      .filter(Boolean),
  );

  RUTAS_SIEMPRE_DISPONIBLES.forEach((ruta) => {
    urlsPermitidas.add(ruta);
  });

  return TOUR_PAGES_CLIENTES_ORDER.filter((url) => urlsPermitidas.has(url));
};

export const getClientesTourSteps = (
  permisos: ResponsePermisosInterface[] = [],
): Record<string, TourStep[]> => {
  const rutasPermitidas = ordenarPermisosClientes(permisos);

  const steps: Record<string, TourStep[]> = {};

  rutasPermitidas.forEach((ruta) => {
    if (agroClientesSteps[ruta]) {
      steps[ruta] = agroClientesSteps[ruta];
    }
  });

  return steps;
};

export const getNextClienteTourRoute = (
  pathname: string,
  permisos: ResponsePermisosInterface[] = [],
): string | null => {
  const rutas = ordenarPermisosClientes(permisos);

  const currentIndex = rutas.indexOf(pathname);

  if (currentIndex === -1 || currentIndex >= rutas.length - 1) {
    return null;
  }

  return rutas[currentIndex + 1];
};

export const getPreviousClienteTourRoute = (
  pathname: string,
  permisos: ResponsePermisosInterface[] = [],
): string | null => {
  const rutas = ordenarPermisosClientes(permisos);

  const currentIndex = rutas.indexOf(pathname);

  if (currentIndex <= 0) {
    return null;
  }

  return rutas[currentIndex - 1];
};
