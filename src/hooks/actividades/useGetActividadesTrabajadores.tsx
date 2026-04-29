import { obtenerActividades } from "@/api/actividades/accions/obtener-actividades";
import { FiltrosActividades } from "@/interfaces/filtros/filters-actividades.interface";
import { useQuery } from "@tanstack/react-query";

const useGetActividadesTrabajadores = (filtros?: FiltrosActividades) => {
  return useQuery({
    queryKey: ["actividades", filtros],
    queryFn: () => obtenerActividades(filtros),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetActividadesTrabajadores;
