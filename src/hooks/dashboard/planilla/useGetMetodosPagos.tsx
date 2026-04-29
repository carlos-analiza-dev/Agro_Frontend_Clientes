import { ObtenerResumenMetodosPagos } from "@/api/dashboard/accions/planillas/resumen-metodos-pagos";
import { FiltrosPlanilla } from "@/interfaces/filtros/filters-planilla";
import { useQuery } from "@tanstack/react-query";

const useGetMetodosPagos = (filters?: FiltrosPlanilla) => {
  return useQuery({
    queryKey: ["metodos-pagos", filters],
    queryFn: () => ObtenerResumenMetodosPagos(filters),
    retry: 0,
  });
};

export default useGetMetodosPagos;
