import { ObtenerGastos } from "@/api/finanzas/gastos/accions/obtener-gastos";
import { FiltrosGastos } from "@/interfaces/filtros/filtros-gastos";
import { useQuery } from "@tanstack/react-query";

const useGetObtenerGastos = (filtros?: FiltrosGastos) => {
  return useQuery({
    queryKey: ["gastos", filtros],
    queryFn: () => ObtenerGastos(filtros),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetObtenerGastos;
