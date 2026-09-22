import { obtenerSanidadById } from "@/api/sanidad-animal/accions/obtener-sanidad-animales";
import { useQuery } from "@tanstack/react-query";

const useGetSanidadAnimalById = (id: string) => {
  return useQuery({
    queryKey: [`sanidad-animal-${id}`, id],
    queryFn: () => obtenerSanidadById(id),
    enabled: !!id,
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetSanidadAnimalById;
