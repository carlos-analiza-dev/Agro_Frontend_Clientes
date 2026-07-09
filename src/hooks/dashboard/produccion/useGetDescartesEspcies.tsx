import { obtenerDescartesPorEspecie } from "@/api/dashboard/accions/produccion/obtener-descartes-especies";
import { useQuery } from "@tanstack/react-query";

const useGetDescartesEspcies = (mes?: string) => {
  return useQuery({
    queryKey: ["descartes", mes],
    queryFn: () => obtenerDescartesPorEspecie(mes),
    retry: 1,
  });
};

export default useGetDescartesEspcies;
