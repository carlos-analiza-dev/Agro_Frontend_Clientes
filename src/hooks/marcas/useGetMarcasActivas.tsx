import { ObtenerMarcasActivas } from "@/api/marcas/accions/obtener-marcas-activas";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetMarcasActivas = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["marcas-activas", filters],
    queryFn: () => ObtenerMarcasActivas(filters),
    retry: 0,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetMarcasActivas;
