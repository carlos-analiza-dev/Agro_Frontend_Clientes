import { obtenerProductosFrecuentes } from "@/api/agroservicio/clientes/accions/productos-mas-comprados";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetProductosFrecuentes = (
  clienteId: string,
  filters?: PaginationInterface,
) => {
  return useQuery({
    queryKey: ["productos-frecuentes", clienteId, filters],
    queryFn: () => obtenerProductosFrecuentes(clienteId, filters),
    retry: 1,
    enabled: !!clienteId,
  });
};

export default useGetProductosFrecuentes;
