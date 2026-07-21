import { obtenerProductosAgro } from "@/api/agroservicio/productos/accions/obtener-productos";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetAgroProductos = (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  return useQuery({
    queryKey: ["agro-productos", , propietarioId, filters],
    queryFn: () => obtenerProductosAgro(propietarioId, filters),
    enabled: !!propietarioId,
    retry: 1,
  });
};

export default useGetAgroProductos;
