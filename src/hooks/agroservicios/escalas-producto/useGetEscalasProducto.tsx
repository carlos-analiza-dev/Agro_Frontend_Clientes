import { ObtenerEscalasProducto } from "@/api/agroservicio/escala-producto/accions/obtener-escala-producto";
import { useQuery } from "@tanstack/react-query";

const useGetEscalasProducto = (
  limit: number = 10,
  offset: number,
  producto: string,
) => {
  return useQuery({
    queryKey: ["escalas-producto", limit, offset, producto],
    queryFn: () => ObtenerEscalasProducto(limit, offset, producto),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetEscalasProducto;
