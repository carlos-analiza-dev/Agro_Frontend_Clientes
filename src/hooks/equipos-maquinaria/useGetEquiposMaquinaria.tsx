import { obtenerEquipos } from "@/api/equipos-maquinaria/accions/obtener-equipos";
import { FiltrosEquipos } from "@/interfaces/filtros/filtros-equipos";
import { useQuery } from "@tanstack/react-query";

const useGetEquiposMaquinaria = (filters?: FiltrosEquipos) => {
  return useQuery({
    queryKey: ["equipos-maquinaria", filters],
    queryFn: () => obtenerEquipos(filters),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetEquiposMaquinaria;
