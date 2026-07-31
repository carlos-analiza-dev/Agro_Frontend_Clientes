import ObtenerProductosDisponibles from "@/api/agroservicio/productos/accions/obtener-productos-disponibles";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetProductosDisponibles = (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  return useQuery({
    queryKey: ["productos-disponibles", propietarioId, filters],
    queryFn: () => ObtenerProductosDisponibles(propietarioId, filters),

    retry: 0,
    enabled: !!propietarioId,
  });
};

export default useGetProductosDisponibles;
