import { ObtenerResumenEstados } from "@/api/dashboard/accions/planillas/resumen-estados.-planilla";
import { useQuery } from "@tanstack/react-query";

const useGetResumenEstadosPlanilla = () => {
  return useQuery({
    queryKey: ["resumen-estados"],
    queryFn: ObtenerResumenEstados,
    retry: 0,
  });
};

export default useGetResumenEstadosPlanilla;
