import { ObtenerInventarioProductos } from "@/api/inventario-productos/accions/obtener-inventario";
import { useQuery } from "@tanstack/react-query";

const useGetInventarioProductos = (
  limit: number = 10,
  offset: number = 0,
  fincaId: string = "",
) => {
  return useQuery({
    queryKey: ["inventario-productos", limit, offset, fincaId],
    queryFn: () => ObtenerInventarioProductos(limit, offset, fincaId),
    staleTime: 5 * 60 * 1000,
  });
};

export default useGetInventarioProductos;
