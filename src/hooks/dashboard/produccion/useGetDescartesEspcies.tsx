import { obtenerDescartesPorEspecie } from "@/api/dashboard/accions/produccion/obtener-descartes-especies";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetDescartesEspcies = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["descartes", filters],
    queryFn: () => obtenerDescartesPorEspecie(filters),
    retry: 1,
  });
};

export default useGetDescartesEspcies;
