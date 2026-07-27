import { obtenerAuditoriaMovimientosLote } from "@/api/agroservicio/auditoria/accions/obtener-auditoria-movimiento-lote";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetAuditoriaMovimientosLote = (filtros?: PaginationInterface) => {
  return useQuery({
    queryKey: ["auditoria-mov-lotes", filtros],
    queryFn: () => obtenerAuditoriaMovimientosLote(filtros),
    retry: 1,
  });
};

export default useGetAuditoriaMovimientosLote;
