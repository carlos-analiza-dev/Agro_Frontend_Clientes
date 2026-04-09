import { useInfiniteQuery } from "@tanstack/react-query";
import { ObtenerProductosPublicos } from "@/api/productos/accions/obtener-productos-publicos-disponibles";

const useGetProductosPublicosDisponibles = (
  limit = 10,
  categoria = "",
  pais = "",
) => {
  return useInfiniteQuery({
    queryKey: ["obtener-productos-publicos-disponibles", categoria, pais],
    queryFn: ({ pageParam = 0 }) =>
      ObtenerProductosPublicos({
        pageParam,
        limit,
        categoria,
        pais,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.length * limit;
    },
    retry: false,
    enabled: true,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetProductosPublicosDisponibles;
