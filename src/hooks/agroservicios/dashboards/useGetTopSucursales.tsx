import { obtenerTopSucursalesAgro } from "@/api/agroservicio/dashboard/accions/obtener-top-suc-agro";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetTopSucursales = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["metricas-sucursales", filters],
    queryFn: () => obtenerTopSucursalesAgro(filters),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetTopSucursales;
