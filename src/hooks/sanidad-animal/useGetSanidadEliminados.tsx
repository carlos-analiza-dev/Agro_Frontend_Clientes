import { obtenerEventosEliminados } from "@/api/sanidad-animal/accions/obtener-sanidad-animales";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetSanidadEliminados = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["sanidad-eliminados", filters],
    queryFn: () => obtenerEventosEliminados(filters),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetSanidadEliminados;
