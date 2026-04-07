import { ObtenerRentabilidadPorFinca } from "@/api/finanzas/rentabilidad/accions/obtener-rentabilidad-por-finca";
import { FiltrosRentabilidad } from "@/api/finanzas/rentabilidad/interface/rentabilidad.interface";
import { useQuery } from "@tanstack/react-query";

const useGetRentabilidadPorFinca = (filtros?: FiltrosRentabilidad) => {
  return useQuery({
    queryKey: ["rentabilidad-fincas", filtros],
    queryFn: () => ObtenerRentabilidadPorFinca(filtros),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetRentabilidadPorFinca;
