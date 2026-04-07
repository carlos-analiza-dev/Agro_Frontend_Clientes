import { ObtenerRentabilidadPorPeriodo } from "@/api/finanzas/rentabilidad/accions/obtener-rentabilidad-por-periodo";
import { FiltrosRentabilidad } from "@/api/finanzas/rentabilidad/interface/rentabilidad.interface";
import { useQuery } from "@tanstack/react-query";

const useGetRentabilidadPorPeriodo = (
  periodo: "day" | "week" | "month" | "year",
  filtros?: FiltrosRentabilidad,
) => {
  return useQuery({
    queryKey: ["rentabilidad-periodo", periodo, filtros],
    queryFn: () => ObtenerRentabilidadPorPeriodo(periodo, filtros),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetRentabilidadPorPeriodo;
