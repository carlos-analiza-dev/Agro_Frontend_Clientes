import { obtenerRangosAgroFacturas } from "@/api/agroservicio/facturacion/accions/obtener-rangos-factura";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetAgroRangosFactura = (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  return useQuery({
    queryKey: ["agro-rangos", propietarioId, filters],
    queryFn: () => obtenerRangosAgroFacturas(propietarioId, filters),
    enabled: !!propietarioId,
    retry: false,
  });
};

export default useGetAgroRangosFactura;
