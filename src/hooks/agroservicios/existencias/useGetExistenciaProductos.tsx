import { obtenerExistenciaProductos } from "@/api/agroservicio/existencia_productos/accions/obtener-existencia-productos";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetExistenciaProductos = (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  return useQuery({
    queryKey: ["existencia-productos", propietarioId, filters],
    queryFn: () => obtenerExistenciaProductos(propietarioId, filters),
    enabled: !!propietarioId,
    retry: false,
  });
};

export default useGetExistenciaProductos;
