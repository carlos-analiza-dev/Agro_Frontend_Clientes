import { obtenerClientesAgro } from "@/api/agroservicio/clientes/accions/obtener-clientes-agro";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetClientesAgro = (
  propietarioId: string,
  filtros?: PaginationInterface,
) => {
  return useQuery({
    queryKey: ["agro-clientes", propietarioId, filtros],
    queryFn: () => obtenerClientesAgro(propietarioId, filtros),
    enabled: !!propietarioId,
    retry: 1,
  });
};

export default useGetClientesAgro;
