import { obtenerAnimalesMarketSugeridos } from "@/api/market-animales/accions/obtener-animales-market-sugeridos";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useInfiniteQuery } from "@tanstack/react-query";

const LIMIT = 12;

const useGetAnimalesMarketSugerencias = (filters?: PaginationInterface) => {
  return useInfiniteQuery({
    queryKey: ["animales-market-sugerencias", filters],

    queryFn: ({ pageParam = 0 }) =>
      obtenerAnimalesMarketSugeridos({
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
    enabled:
      !!filters?.categoriaId &&
      !!filters.subcategoriaId &&
      !!filters.tipoProductoId,
  });
};

export default useGetAnimalesMarketSugerencias;
