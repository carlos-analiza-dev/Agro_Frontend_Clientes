import { obtenerMetricasResFacturas } from "@/api/agroservicio/dashboard/accions/obtener-metricas-facturas";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetMetricasFacturas = (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  return useQuery({
    queryKey: ["metricas-factura", propietarioId, filters],
    queryFn: () => obtenerMetricasResFacturas(propietarioId, filters),
    enabled: !!propietarioId,
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetMetricasFacturas;
