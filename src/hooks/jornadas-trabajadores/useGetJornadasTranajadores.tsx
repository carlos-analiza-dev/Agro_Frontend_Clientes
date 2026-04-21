import { obtenerJornadasTrabajadores } from "@/api/jornadas-trabajador/accions/obtener-jornadas";
import { FiltrosJornadas } from "@/interfaces/filtros/filtros-jornadas.interface";
import { useQuery } from "@tanstack/react-query";

const useGetJornadasTranajadores = (filtros?: FiltrosJornadas) => {
  return useQuery({
    queryKey: ["jornadas", filtros],
    queryFn: () => obtenerJornadasTrabajadores(filtros),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetJornadasTranajadores;
