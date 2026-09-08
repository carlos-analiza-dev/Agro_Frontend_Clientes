import { ObtenerEspeciesFincas } from "@/api/fincas/accions/obtener-especies-fincas";
import { useQuery } from "@tanstack/react-query";

const useGetEspeciesByFincas = () => {
  return useQuery({
    queryKey: ["especies-fincas"],
    queryFn: ObtenerEspeciesFincas,
    retry: 0,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetEspeciesByFincas;
