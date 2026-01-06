import { obtenerRatingByProducto } from "@/api/rating-producto/accions/mostrar-rating-producto";
import { ResponseRatingProductos } from "@/api/rating-producto/interfaces/response-rating-producto.interface";
import { useQuery } from "@tanstack/react-query";

const useGetRatingProducto = (productoId: string) => {
  return useQuery<ResponseRatingProductos>({
    queryKey: ["rating", productoId],
    queryFn: () => obtenerRatingByProducto(productoId),
    staleTime: 1000 * 60 * 5,

    retry: false,
  });
};

export default useGetRatingProducto;
