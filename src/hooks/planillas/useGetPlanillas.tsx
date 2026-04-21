import { obtenerPlanillasTrabajadores } from "@/api/planillas-trabajadores/accions/obtener-planilla";
import { FiltrosPlanilla } from "@/interfaces/filtros/filters-planilla";
import { useQuery } from "@tanstack/react-query";

const useGetPlanillas = (filtros?: FiltrosPlanilla) => {
  return useQuery({
    queryKey: ["planillas", filtros],
    queryFn: () => obtenerPlanillasTrabajadores(filtros),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetPlanillas;
