import { obtenerMantenimientos } from "@/api/mantenimientos/accions/obtener-mantenimientos";
import { FiltrosMantenimiento } from "@/interfaces/filtros/filtros-mantenimientos.interface";
import { useQuery } from "@tanstack/react-query";

const useGetMantenimientos = (filters?: FiltrosMantenimiento) => {
  return useQuery({
    queryKey: ["mantenimientos", filters],
    queryFn: () => obtenerMantenimientos(filters),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetMantenimientos;
