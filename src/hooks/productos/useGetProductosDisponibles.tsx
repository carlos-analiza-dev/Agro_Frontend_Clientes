import { useInfiniteQuery } from "@tanstack/react-query";
import { ObtenerProductos } from "@/api/productos/accions/obtener-productos-disponibles";

const useGetProductosDisponibles = (limit = 10, categoria = "") => {
  return useInfiniteQuery({
    queryKey: ["obtener-productos-disponibles", categoria],
    queryFn: ({ pageParam = 0 }) =>
      ObtenerProductos({
        pageParam,
        limit,
        categoria,
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

export default useGetProductosDisponibles;
