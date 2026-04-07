import { ObtenerRentabilidadGeneral } from "@/api/finanzas/rentabilidad/accions/obtener-rentabilidad-general";
import { FiltrosRentabilidad } from "@/api/finanzas/rentabilidad/interface/rentabilidad.interface";
import { useQuery } from "@tanstack/react-query";

const useGetRentabilidadGeneral = (filtros?: FiltrosRentabilidad) => {
  return useQuery({
    queryKey: ["rentabilidad-general", filtros],
    queryFn: () => ObtenerRentabilidadGeneral(filtros),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetRentabilidadGeneral;
