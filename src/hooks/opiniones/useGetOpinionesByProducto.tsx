import { obtenerOpinionesByProducto } from "@/api/opiniones/accions/mostrar-opiniones-producto";
import { ResponseOpinionesByProducto } from "@/api/opiniones/interfaces/response-opiniones.interface";
import { useQuery } from "@tanstack/react-query";

interface UseGetOpinionesByProductoParams {
  productoId: string;
  limit?: number;
  offset?: number;
}

const useGetOpinionesByProducto = ({
  productoId,
  limit = 5,
  offset = 0,
}: UseGetOpinionesByProductoParams) => {
  return useQuery<ResponseOpinionesByProducto>({
    queryKey: ["opiniones", productoId, limit, offset],
    queryFn: () => obtenerOpinionesByProducto(productoId, limit, offset),
    staleTime: 1000 * 60 * 5,

    retry: false,
  });
};

export default useGetOpinionesByProducto;
