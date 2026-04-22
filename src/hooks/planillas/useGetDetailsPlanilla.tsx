import { obtenerDetallesPlanillasTrabajadores } from "@/api/planillas-trabajadores/accions/obtener-detalles-planilla";
import { useQuery } from "@tanstack/react-query";

const useGetDetailsPlanilla = (id: string) => {
  return useQuery({
    queryKey: ["planilla-details", id],
    queryFn: () => obtenerDetallesPlanillasTrabajadores(id),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetDetailsPlanilla;
