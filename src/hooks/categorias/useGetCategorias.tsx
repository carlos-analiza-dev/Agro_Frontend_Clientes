import { ObtenerCategorias } from "@/api/categorias/accions/obtener-categorias";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetCategorias = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["categorias", filters],
    queryFn: () => ObtenerCategorias(filters),
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetCategorias;
