import { obtenerTodosProductosAgro } from "@/api/agroservicio/productos/accions/obtener-productos";
import { useQuery } from "@tanstack/react-query";

const useGetAllProducts = (propietarioId: string) => {
  return useQuery({
    queryKey: ["agro-all-productos", , propietarioId],
    queryFn: () => obtenerTodosProductosAgro(propietarioId),
    enabled: !!propietarioId,
    retry: 1,
  });
};

export default useGetAllProducts;
