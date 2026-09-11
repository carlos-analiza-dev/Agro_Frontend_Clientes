import { obtenerAllPublicaciones } from "@/api/market-animales/accions/obtener-publicaciones";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useInfiniteQuery } from "@tanstack/react-query";

const LIMIT = 12;

const useGetAllPublicaciones = (filters?: PaginationInterface) => {
  return useInfiniteQuery({
    queryKey: ["publicaciones", filters],

    queryFn: ({ pageParam = 0 }) =>
      obtenerAllPublicaciones({
        ...filters,
        limit: LIMIT,
        offset: pageParam * LIMIT,
      }),

    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce(
        (total, page) => total + page.productos.length,
        0,
      );

      return totalLoaded < lastPage.total ? allPages.length : undefined;
    },

    retry: 0,
    staleTime: 1000 * 60 * 2,
    enabled: !!filters?.latitud && !!filters?.longitud,
  });
};

export default useGetAllPublicaciones;
