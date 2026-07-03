import { obtenerSanidadAnimal } from "@/api/sanidad-animal/accions/obtener-sanidad-animales";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetSanidadAnimal = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["sanidad-animal", filters],
    queryFn: () => obtenerSanidadAnimal(filters),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetSanidadAnimal;
