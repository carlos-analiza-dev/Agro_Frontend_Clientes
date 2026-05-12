import { ObtenerAreaCultivoByFinca } from "@/api/dashboard/accions/agricola/area-finca-cultivos";
import { useQuery } from "@tanstack/react-query";

const useGetAreaCultivoByFinca = () => {
  return useQuery({
    queryKey: ["area-cultivo"],
    queryFn: ObtenerAreaCultivoByFinca,
    retry: 0,
    staleTime: 60 * 5 * 100,
  });
};

export default useGetAreaCultivoByFinca;
