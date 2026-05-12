import { ObtenerResumenCultivos } from "@/api/dashboard/accions/agricola/resumen-cultivos";
import { useQuery } from "@tanstack/react-query";

const useGetResumenCultivos = () => {
  return useQuery({
    queryKey: ["resumen-cultivos"],
    queryFn: ObtenerResumenCultivos,
    retry: 0,
    staleTime: 60 * 5 * 100,
  });
};

export default useGetResumenCultivos;
