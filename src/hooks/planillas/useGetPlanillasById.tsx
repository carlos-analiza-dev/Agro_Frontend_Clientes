import { obtenerPlanillasTrabajadoresById } from "@/api/planillas-trabajadores/accions/obtener-planilla-id";
import { useQuery } from "@tanstack/react-query";

const useGetPlanillasById = (id: string) => {
  return useQuery({
    queryKey: ["planillas-id", id],
    queryFn: () => obtenerPlanillasTrabajadoresById(id),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetPlanillasById;
