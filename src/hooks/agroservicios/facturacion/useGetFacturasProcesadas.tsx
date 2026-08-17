import { ObtenerFacturasProcesadas } from "@/api/agroservicio/facturacion/accions/obtener-facturas-procesadas-agroservicio";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetFacturasProcesadas = (
  propietarioId: string,
  filtros?: PaginationInterface,
) => {
  return useQuery({
    queryKey: ["facturas-procesadas", filtros],
    queryFn: () => ObtenerFacturasProcesadas(propietarioId, filtros),
    retry: false,
    staleTime: 60 * 1000 * 5,
    enabled: !!propietarioId,
  });
};

export default useGetFacturasProcesadas;
