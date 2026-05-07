import { obtenerUsoEquipos } from "@/api/uso-equipos/accions/obtener-uso-equipos";
import { FiltrosUsoEquipos } from "@/interfaces/filtros/filtros-uso-equipos.interface";
import { useQuery } from "@tanstack/react-query";

const useGetUsoEquipos = (filtros?: FiltrosUsoEquipos) => {
  return useQuery({
    queryKey: ["uso-equipos", filtros],
    queryFn: () => obtenerUsoEquipos(filtros),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetUsoEquipos;
