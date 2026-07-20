import { obtenerProveedoresAgro } from "@/api/agroservicio/proveedores/accions/obtener-agro-prov";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetProveedoresAgro = (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  return useQuery({
    queryKey: ["agro-proveedores", , propietarioId, filters],
    queryFn: () => obtenerProveedoresAgro(propietarioId, filters),
    enabled: !!propietarioId,
    staleTime: 60 * 5 * 1000,
    retry: 1,
  });
};

export default useGetProveedoresAgro;
