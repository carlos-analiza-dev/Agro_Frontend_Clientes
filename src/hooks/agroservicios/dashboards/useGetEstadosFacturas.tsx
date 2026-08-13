import { obtenerEstadosFactura } from "@/api/agroservicio/dashboard/accions/obtener-estados-facturas";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetEstadosFacturas = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["metricas-estados", filters],
    queryFn: () => obtenerEstadosFactura(filters),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetEstadosFacturas;
