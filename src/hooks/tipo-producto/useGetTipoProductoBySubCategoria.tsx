import { ObtenerTipoProductoBySubCat } from "@/api/tipo-producto/accions/obtener-tipo-producto-subcategoria";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetTipoProductoBySubCategoria = (
  id: string,
  filters?: PaginationInterface,
) => {
  return useQuery({
    queryKey: ["tipo-producto-subcat", id, filters],
    queryFn: () => ObtenerTipoProductoBySubCat(id, filters),
    retry: false,
    enabled: !!id,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetTipoProductoBySubCategoria;
