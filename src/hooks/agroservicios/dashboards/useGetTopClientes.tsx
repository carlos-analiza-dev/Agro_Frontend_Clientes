import { obtenerMetricasClientesMasCompras } from "@/api/agroservicio/dashboard/accions/obtener-clientes-compras";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetTopClientes = (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  return useQuery({
    queryKey: ["metricas-clientes", propietarioId, filters],
    queryFn: () => obtenerMetricasClientesMasCompras(propietarioId, filters),
    enabled: !!propietarioId,
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetTopClientes;
