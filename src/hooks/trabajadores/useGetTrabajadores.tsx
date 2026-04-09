import { obtenerTrabajadores } from "@/api/trabajadores/accions/obtener-trabajadores";
import { FiltrosTrabajadores } from "@/interfaces/filtros/filtros-trabajadores";
import { useQuery } from "@tanstack/react-query";

const useGetTrabajadores = (filtros?: FiltrosTrabajadores) => {
  return useQuery({
    queryKey: ["trabajadores", filtros],
    queryFn: () => obtenerTrabajadores(filtros),
    retry: 1,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetTrabajadores;
