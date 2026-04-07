import { ObtenerRentabilidadPorCategoria } from "@/api/finanzas/rentabilidad/accions/obtener-rentabilidad-por-categoria";
import { FiltrosRentabilidad } from "@/api/finanzas/rentabilidad/interface/rentabilidad.interface";
import { useQuery } from "@tanstack/react-query";

const useGetRentabilidadPorCategoria = (filtros?: FiltrosRentabilidad) => {
  return useQuery({
    queryKey: ["rentabilidad-categorias", filtros],
    queryFn: () => ObtenerRentabilidadPorCategoria(filtros),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetRentabilidadPorCategoria;
