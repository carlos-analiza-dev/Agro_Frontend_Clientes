import { obtenerMovimientosLotes } from "@/api/agroservicio/movimientos-lotes/accions/obtener-movimientos-lotes";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetMovimientosLotes = (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  return useQuery({
    queryKey: ["movimientos-lotes", propietarioId, filters],
    queryFn: () => obtenerMovimientosLotes(propietarioId, filters),
    retry: 1,
    enabled: !!propietarioId,
  });
};

export default useGetMovimientosLotes;
