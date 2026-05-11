import { obtenerCultivos } from "@/api/cultivos/accions/obtener-cultivos";
import { FiltersCultivos } from "@/interfaces/filtros/cultivos-filters.interface";
import { useQuery } from "@tanstack/react-query";

const useGetCultivos = (filters?: FiltersCultivos) => {
  return useQuery({
    queryKey: ["cultivos", filters],
    queryFn: () => obtenerCultivos(filters),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetCultivos;
