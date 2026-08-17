import { obtenerNotaCredito } from "@/api/agroservicio/notas-credito/accions/obtener-notas-credito";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetNotaCreditos = (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  return useQuery({
    queryKey: ["notas-credito", propietarioId, filters],
    queryFn: () => obtenerNotaCredito(propietarioId, filters),
    enabled: !!propietarioId,
    retry: 1,
  });
};

export default useGetNotaCreditos;
