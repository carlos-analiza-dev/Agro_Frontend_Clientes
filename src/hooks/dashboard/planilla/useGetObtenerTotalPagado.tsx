import { ObtenerTotalPagadoPlanilla } from "@/api/dashboard/accions/planillas/obtener-total-pagado-planilla";
import { FiltrosPlanilla } from "@/interfaces/filtros/filters-planilla";
import { useQuery } from "@tanstack/react-query";

const useGetObtenerTotalPagado = (filters?: FiltrosPlanilla) => {
  return useQuery({
    queryKey: ["total-pagados", filters],
    queryFn: () => ObtenerTotalPagadoPlanilla(filters),
    retry: 0,
  });
};

export default useGetObtenerTotalPagado;
