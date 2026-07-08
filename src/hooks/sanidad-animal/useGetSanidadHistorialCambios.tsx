import { obtenerEventosHistorialCambios } from "@/api/sanidad-animal/accions/obtener-historial-cambios";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetSanidadHistorialCambios = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["sanidad-cambios", filters],
    queryFn: () => obtenerEventosHistorialCambios(filters),
    retry: 1,
    staleTime: 60 * 5 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export default useGetSanidadHistorialCambios;
