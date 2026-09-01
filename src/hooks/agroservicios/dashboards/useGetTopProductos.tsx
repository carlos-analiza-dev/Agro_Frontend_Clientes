import { obtenerMetricasProductosMasVendidos } from "@/api/agroservicio/dashboard/accions/obtener-productos-mas-vendidos";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetTopProductos = (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  return useQuery({
    queryKey: ["metricas-productos", propietarioId, filters],
    queryFn: () => obtenerMetricasProductosMasVendidos(propietarioId, filters),
    enabled: !!propietarioId,
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetTopProductos;
