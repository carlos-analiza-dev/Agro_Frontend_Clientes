import { ObtenerPartosAnimales } from "@/api/reproduccion/accions/partos/obtener-partos";
import { FiltrosPartos } from "@/interfaces/filtros/filtros-partos";
import { useQuery } from "@tanstack/react-query";

const useGetPartosAnimales = (filtros?: FiltrosPartos) => {
  return useQuery({
    queryKey: ["partos-animal", filtros],
    queryFn: () => ObtenerPartosAnimales(filtros),
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetPartosAnimales;
