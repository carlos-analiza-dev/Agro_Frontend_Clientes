import { ObtenerResumenHorasExtra } from "@/api/dashboard/accions/planillas/resumen-horas-extras";
import { FiltrosPlanilla } from "@/interfaces/filtros/filters-planilla";
import { useQuery } from "@tanstack/react-query";

const useGetResumenHoras = (filters?: FiltrosPlanilla) => {
  return useQuery({
    queryKey: ["resumen-horas", filters],
    queryFn: () => ObtenerResumenHorasExtra(filters),
    retry: 0,
  });
};

export default useGetResumenHoras;
