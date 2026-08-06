import { ObtenerComprasAgroInsumos } from "@/api/agroservicio/compras_insumos/accions/obtener-compras-insumos";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetComprasAgroInsumos = (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  return useQuery({
    queryKey: ["compras-agro-insumos", propietarioId, filters],
    queryFn: () => ObtenerComprasAgroInsumos(propietarioId, filters),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetComprasAgroInsumos;
