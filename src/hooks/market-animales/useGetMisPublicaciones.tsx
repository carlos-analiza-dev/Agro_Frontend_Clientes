import { obtenerMisPublicaciones } from "@/api/market-animales/accions/obtener-mis-publicaciones";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetMisPublicaciones = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["mis-publicaciones", filters],
    queryFn: () => obtenerMisPublicaciones(filters),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetMisPublicaciones;
