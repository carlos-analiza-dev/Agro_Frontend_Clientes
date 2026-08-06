import { ObtenerEscalasInsumo } from "@/api/agroservicio/escalas-insumos/accions/obtener-escalas-insumo";
import { useQuery } from "@tanstack/react-query";

const useGetEscalasInsumos = (
  limit: number = 10,
  offset: number,
  insumo: string,
) => {
  return useQuery({
    queryKey: ["escalas-insumo", limit, offset, insumo],
    queryFn: () => ObtenerEscalasInsumo(limit, offset, insumo),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetEscalasInsumos;
