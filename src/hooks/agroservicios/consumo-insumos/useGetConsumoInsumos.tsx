import { obtenerConsumoInsumos } from "@/api/agroservicio/consumo-insumos/accions/obtener-consumo-insumo";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetConsumoInsumos = (
  propietarioId: string,
  filtros?: PaginationInterface,
) => {
  return useQuery({
    queryKey: ["consumo-insumos", propietarioId, filtros],
    queryFn: () => obtenerConsumoInsumos(propietarioId, filtros),
    enabled: !!propietarioId,
    retry: 1,
  });
};

export default useGetConsumoInsumos;
