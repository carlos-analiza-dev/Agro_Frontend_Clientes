import { obtenerExistenciaInsumos } from "@/api/agroservicio/lotes-insumos/accions/obtener-existencia-insumo";
import { useQuery } from "@tanstack/react-query";

const useGetExistenciasAgroInsumos = (sucursalId: string, insumoId: string) => {
  return useQuery({
    queryKey: ["existencia-agro-insumos", sucursalId, insumoId],
    queryFn: () => obtenerExistenciaInsumos(sucursalId, insumoId),
    enabled: !!sucursalId && !!insumoId,
    retry: 1,
  });
};

export default useGetExistenciasAgroInsumos;
