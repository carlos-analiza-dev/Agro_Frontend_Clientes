import { ObtenerCultivosPorTipo } from "@/api/dashboard/accions/agricola/cultivos-tipo";
import { useQuery } from "@tanstack/react-query";

const useGetCultivosPorTipo = () => {
  return useQuery({
    queryKey: ["cultivos-tipo"],
    queryFn: ObtenerCultivosPorTipo,
    retry: 0,
    staleTime: 60 * 5 * 100,
  });
};

export default useGetCultivosPorTipo;
