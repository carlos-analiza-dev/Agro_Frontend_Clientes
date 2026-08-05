import { obtenerInsumosAgro } from "@/api/agroservicio/insumos/accions/obtener-insumos";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetAgroInsumos = (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  return useQuery({
    queryKey: ["agro-insumos", propietarioId, filters],
    queryFn: () => obtenerInsumosAgro(propietarioId, filters),
    retry: 1,
  });
};

export default useGetAgroInsumos;
