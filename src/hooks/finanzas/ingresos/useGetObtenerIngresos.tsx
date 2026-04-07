import { ObtenerIngresos } from "@/api/finanzas/ingresos/accions/obtener-ingresos";
import { FiltrosGastos } from "@/interfaces/filtros/filtros-gastos";
import { useQuery } from "@tanstack/react-query";

const useGetObtenerIngresos = (filtros?: FiltrosGastos) => {
  return useQuery({
    queryKey: ["ingresos", filtros],
    queryFn: () => ObtenerIngresos(filtros),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetObtenerIngresos;
