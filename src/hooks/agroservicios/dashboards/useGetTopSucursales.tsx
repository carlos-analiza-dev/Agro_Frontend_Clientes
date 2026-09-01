import { obtenerTopSucursalesAgro } from "@/api/agroservicio/dashboard/accions/obtener-top-suc-agro";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetTopSucursales = (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  return useQuery({
    queryKey: ["metricas-sucursales", propietarioId, filters],
    queryFn: () => obtenerTopSucursalesAgro(propietarioId, filters),
    enabled: !!propietarioId,
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetTopSucursales;
