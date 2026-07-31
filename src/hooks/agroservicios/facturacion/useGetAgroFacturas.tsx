import { obtenerAgroFacturas } from "@/api/agroservicio/facturacion/accions/obtener-facturas";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetAgroFacturas = (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  return useQuery({
    queryKey: ["agro-facturas", propietarioId, filters],
    queryFn: () => obtenerAgroFacturas(propietarioId, filters),
    enabled: !!propietarioId,
    retry: false,
  });
};

export default useGetAgroFacturas;
