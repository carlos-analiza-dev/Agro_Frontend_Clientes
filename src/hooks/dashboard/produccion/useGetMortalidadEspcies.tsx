import { obtenerMortalidadPorEspecie } from "@/api/dashboard/accions/produccion/obtener-mortalidad-especies";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetMortalidadEspcies = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["mortalidad", filters],
    queryFn: () => obtenerMortalidadPorEspecie(filters),
    retry: 1,
  });
};

export default useGetMortalidadEspcies;
